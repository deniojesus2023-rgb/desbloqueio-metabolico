import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PRODUCTS, type ProductKey } from "@/lib/stripe-products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productKeys, customerEmail, customerName, sessionId } = body as {
      productKeys: ProductKey[];
      customerEmail?: string;
      customerName?: string;
      sessionId?: string;
    };

    const totalAmount = productKeys.reduce((sum, key) => {
      const product = PRODUCTS[key];
      return sum + (product ? product.amount : 0);
    }, 0);

    if (totalAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const description = productKeys
      .map((key) => PRODUCTS[key]?.name)
      .filter(Boolean)
      .join(" + ");

    // Create or retrieve customer
    let customerId: string | undefined;
    if (customerEmail) {
      const existingCustomers = await stripe.customers.list({
        email: customerEmail,
        limit: 1,
      });
      if (existingCustomers.data.length > 0) {
        customerId = existingCustomers.data[0].id;
      } else {
        const customer = await stripe.customers.create({
          email: customerEmail,
          name: customerName,
          metadata: { sessionId: sessionId || "" },
        });
        customerId = customer.id;
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "brl",
      description,
      customer: customerId,
      payment_method_types: ["card"],
      metadata: {
        sessionId: sessionId || "",
        productKeys: productKeys.join(","),
        customerEmail: customerEmail || "",
        customerName: customerName || "",
      },
      setup_future_usage: "off_session",
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalAmount,
      customerId,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
