import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, type ProductKey } from "@/lib/stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-03-31.basil",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, productKey, sessionId } = body as {
      customerId: string;
      productKey: ProductKey;
      sessionId?: string;
    };

    const product = PRODUCTS[productKey];
    if (!product) {
      return NextResponse.json(
        { error: `Unknown product: ${productKey}` },
        { status: 400 }
      );
    }

    // Get the customer's saved payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    if (paymentMethods.data.length === 0) {
      return NextResponse.json(
        { error: "No saved payment method found" },
        { status: 400 }
      );
    }

    const paymentMethod = paymentMethods.data[0];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: product.amount,
      currency: product.currency,
      customer: customerId,
      payment_method: paymentMethod.id,
      off_session: true,
      confirm: true,
      description: product.name,
      metadata: {
        sessionId: sessionId || "",
        productKey: productKey,
      },
    });

    return NextResponse.json({
      paymentIntentId: paymentIntent.id,
      status: paymentIntent.status,
      amount: product.amount,
    });
  } catch (error) {
    console.error("Error charging upsell:", error);
    const message =
      error instanceof Error ? error.message : "Failed to charge upsell";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
