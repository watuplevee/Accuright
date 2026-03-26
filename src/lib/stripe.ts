import Stripe from "stripe";

// ============================================================
// STRIPE CLIENT SINGLETON
// ============================================================

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing required environment variable: STRIPE_SECRET_KEY");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-02-24.acacia",
  typescript: true,
  appInfo: {
    name: "Accuright",
    version: "1.0.0",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://accuright.com",
  },
});

// ============================================================
// HELPER — Create Checkout Session
// ============================================================

export interface CreateCheckoutSessionParams {
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  orderId: string;
  orderNumber: string;
  customerEmail?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export async function createCheckoutSession(
  params: CreateCheckoutSessionParams
): Promise<Stripe.Checkout.Session> {
  const {
    lineItems,
    orderId,
    orderNumber,
    customerEmail,
    successUrl,
    cancelUrl,
    metadata = {},
  } = params;

  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: customerEmail,
    success_url: successUrl,
    cancel_url: cancelUrl,
    payment_intent_data: {
      metadata: {
        orderId,
        orderNumber,
        ...metadata,
      },
    },
    metadata: {
      orderId,
      orderNumber,
      ...metadata,
    },
    shipping_address_collection: {
      allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "JP"],
    },
    billing_address_collection: "required",
    allow_promotion_codes: true,
    phone_number_collection: {
      enabled: true,
    },
  });
}

// ============================================================
// HELPER — Construct Webhook Event
// ============================================================

export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
}

// ============================================================
// HELPER — Format Amount for Stripe (cents)
// ============================================================

export function toStripeAmount(dollars: number): number {
  return Math.round(dollars * 100);
}

// ============================================================
// HELPER — Format Amount from Stripe (dollars)
// ============================================================

export function fromStripeAmount(cents: number): number {
  return cents / 100;
}
