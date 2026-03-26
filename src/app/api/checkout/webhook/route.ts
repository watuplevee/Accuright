import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { sendOrderNotification } from '@/lib/integrations/slack';
import { createOrUpdateLead } from '@/lib/integrations/salesforce';
import { subscribeContact } from '@/lib/integrations/constant-contact';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent
): Promise<void> {
  const { cartId, userId, sessionId, customerEmail } = paymentIntent.metadata ?? {};

  if (!cartId) {
    console.error('[Webhook] payment_intent.succeeded missing cartId in metadata', paymentIntent.id);
    return;
  }

  // Fetch cart with full item details
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  });

  if (!cart) {
    console.error('[Webhook] Cart not found for cartId:', cartId);
    return;
  }

  if (cart.items.length === 0) {
    console.warn('[Webhook] Cart is empty for cartId:', cartId);
    return;
  }

  // Generate a human-readable order number
  const orderNumber = `ACC-${Date.now()}`;

  // 1. Create Order with all items
  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: userId || null,
      customerEmail,
      stripePaymentIntentId: paymentIntent.id,
      total: paymentIntent.amount,
      status: 'PAID',
      items: {
        create: cart.items.map((item) => ({
          variantId: item.variantId,
          productId: item.variant.productId,
          quantity: item.quantity,
          unitPrice: item.variant.price ?? item.variant.product.price,
          productName: item.variant.product.name,
          sku: item.variant.sku,
          size: item.variant.size,
          color: item.variant.color,
        })),
      },
    },
    include: { items: true },
  });

  // 2. Decrement stock for each variant
  await Promise.all(
    cart.items.map((item) =>
      prisma.productVariant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      })
    )
  );

  // 3. Clear the cart
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  await prisma.cart.delete({ where: { id: cart.id } });

  // 4. Send Slack order notification (non-blocking, log errors)
  const slackItems = order.items.map((item) => ({
    name: item.productName,
    sku: item.sku ?? undefined,
    size: item.size ?? undefined,
    color: item.color ?? undefined,
    quantity: item.quantity,
    price: item.unitPrice,
  }));

  sendOrderNotification({
    orderNumber: order.orderNumber,
    customerEmail: customerEmail ?? 'unknown',
    total: order.total,
    items: slackItems,
    stripePaymentIntentId: paymentIntent.id,
  }).catch((err) => console.error('[Webhook] Slack notification failed:', err));

  // 5. Upsert Salesforce lead
  if (customerEmail) {
    const nameParts = (paymentIntent.metadata?.customerName ?? '').split(' ');
    const firstName = nameParts[0] ?? 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Unknown';

    createOrUpdateLead({
      FirstName: firstName,
      LastName: lastName,
      Email: customerEmail,
      LeadSource: 'Checkout',
      AccurightCustomerId__c: userId || undefined,
    }).catch((err) => console.error('[Webhook] Salesforce lead upsert failed:', err));
  }

  // 6. Subscribe to Constant Contact if opted in
  const emailOptIn = paymentIntent.metadata?.emailOptIn === 'true';
  if (emailOptIn && customerEmail) {
    const nameParts = (paymentIntent.metadata?.customerName ?? '').split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || undefined;

    subscribeContact(customerEmail, firstName, lastName, 'checkout').catch((err) =>
      console.error('[Webhook] Constant Contact subscribe failed:', err)
    );
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET is not set');
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
  }

  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch (err) {
    return NextResponse.json({ error: 'Failed to read request body' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Webhook] Signature verification failed:', message);
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
      }
      case 'payment_intent.payment_failed': {
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        console.warn('[Webhook] Payment failed for intent:', failedIntent.id);
        break;
      }
      default:
        // Unhandled event types are silently ignored
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
