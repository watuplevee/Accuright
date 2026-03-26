import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import authOptions from '@/lib/auth';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const SESSION_COOKIE = 'accuright_session_id';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id;
    const sessionId = req.cookies.get(SESSION_COOKIE)?.value;

    if (!userId && !sessionId) {
      return NextResponse.json(
        { error: 'Authentication or guest session required' },
        { status: 401 }
      );
    }

    // Fetch the cart
    const cart = await prisma.cart.findFirst({
      where: userId ? { userId } : { sessionId },
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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Validate stock availability and calculate total
    let totalCents = 0;
    const lineItems: Array<{
      variantId: string;
      productId: string;
      name: string;
      sku: string | null;
      size: string | null;
      color: string | null;
      quantity: number;
      unitPrice: number;
    }> = [];

    for (const item of cart.items) {
      const unitPrice = item.variant.price ?? item.variant.product.price;

      if (item.variant.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for "${item.variant.product.name}" (${item.variant.size ?? ''} ${item.variant.color ?? ''}).`.trim(),
          },
          { status: 409 }
        );
      }

      totalCents += unitPrice * item.quantity;
      lineItems.push({
        variantId: item.variantId,
        productId: item.variant.productId,
        name: item.variant.product.name,
        sku: item.variant.sku,
        size: item.variant.size,
        color: item.variant.color,
        quantity: item.quantity,
        unitPrice,
      });
    }

    // Build metadata for Stripe (metadata values must be strings, limit 500 chars)
    const itemsSummary = lineItems
      .map((i) => `${i.name} x${i.quantity}`)
      .join(', ')
      .slice(0, 490);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        cartId: cart.id,
        userId: userId ?? '',
        sessionId: sessionId ?? '',
        itemCount: String(cart.items.length),
        itemsSummary,
        customerEmail: session?.user?.email ?? '',
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('[POST /api/checkout/create-intent]', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
