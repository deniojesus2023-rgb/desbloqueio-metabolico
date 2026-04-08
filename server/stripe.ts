import Stripe from "stripe";
import { PRODUCTS, type ProductKey } from "./stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export { stripe };

/**
 * Create a PaymentIntent for the main offer (+ optional order bump).
 * Returns clientSecret for Stripe Elements on the frontend.
 */
export async function createPaymentIntent(opts: {
  productKeys: ProductKey[];
  customerEmail?: string;
  customerName?: string;
  sessionId?: string;
}) {
  const totalAmount = opts.productKeys.reduce((sum, key) => {
    const product = PRODUCTS[key];
    return sum + (product ? product.amount : 0);
  }, 0);

  if (totalAmount <= 0) throw new Error("Invalid amount");

  const description = opts.productKeys
    .map((key) => PRODUCTS[key]?.name)
    .filter(Boolean)
    .join(" + ");

  // Create or retrieve customer
  let customerId: string | undefined;
  if (opts.customerEmail) {
    const existingCustomers = await stripe.customers.list({
      email: opts.customerEmail,
      limit: 1,
    });
    if (existingCustomers.data.length > 0) {
      customerId = existingCustomers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: opts.customerEmail,
        name: opts.customerName,
        metadata: { sessionId: opts.sessionId || "" },
      });
      customerId = customer.id;
    }
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: "brl",
    description,
    customer: customerId,
    payment_method_types: ["card", "pix"],
    metadata: {
      sessionId: opts.sessionId || "",
      productKeys: opts.productKeys.join(","),
      customerEmail: opts.customerEmail || "",
      customerName: opts.customerName || "",
    },
    // Enable saving the payment method for future one-click charges
    setup_future_usage: "off_session",
  });

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    amount: totalAmount,
    customerId,
  };
}

/**
 * One-click charge for upsells/downsells using saved payment method.
 * No need for the customer to enter card details again.
 */
export async function chargeOneClick(opts: {
  customerId: string;
  productKey: ProductKey;
  sessionId?: string;
}) {
  const product = PRODUCTS[opts.productKey];
  if (!product) throw new Error(`Unknown product: ${opts.productKey}`);

  // Get the customer's saved payment methods
  const paymentMethods = await stripe.paymentMethods.list({
    customer: opts.customerId,
    type: "card",
  });

  if (paymentMethods.data.length === 0) {
    throw new Error("No saved payment method found");
  }

  const paymentMethod = paymentMethods.data[0];

  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.amount,
    currency: product.currency,
    customer: opts.customerId,
    payment_method: paymentMethod.id,
    off_session: true,
    confirm: true,
    description: product.name,
    metadata: {
      sessionId: opts.sessionId || "",
      productKey: opts.productKey,
    },
  });

  return {
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
    amount: product.amount,
  };
}

/**
 * Verify webhook signature and parse event
 */
export function constructWebhookEvent(
  payload: Buffer,
  signature: string
): Stripe.Event {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}
