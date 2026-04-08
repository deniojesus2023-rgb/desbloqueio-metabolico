import express, { type Express, type Request, type Response } from "express";
import { constructWebhookEvent, stripe } from "./stripe";
import { getDb } from "./db";
import { conversions, quizSessions } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { notifyOwner } from "./_core/notification";
import { PRODUCTS, type ProductKey } from "./stripe-products";

export function registerStripeWebhook(app: Express) {
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req: Request, res: Response) => {
      const signature = req.headers["stripe-signature"] as string;

      if (!signature) {
        return res.status(400).json({ error: "Missing stripe-signature header" });
      }

      let event;
      try {
        event = constructWebhookEvent(req.body, signature);
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ error: `Webhook Error: ${err.message}` });
      }

      // Handle test events for verification
      if (event.id.startsWith("evt_test_")) {
        console.log("[Stripe Webhook] Test event detected, returning verification response");
        return res.json({ verified: true });
      }

      console.log(`[Stripe Webhook] Received event: ${event.type} (${event.id})`);

      try {
        switch (event.type) {
          case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as any;
            const { sessionId, productKeys, customerEmail, customerName } = paymentIntent.metadata || {};

            if (productKeys) {
              const keys = productKeys.split(",");
              const db = await getDb();
              if (db) {
                for (const key of keys) {
                  const typeMap: Record<string, string> = {
                    main_offer: "main_offer",
                    order_bump: "order_bump",
                    upsell_1: "upsell_1",
                    downsell_1: "downsell_1",
                    upsell_2: "upsell_2",
                  };
                  const conversionType = typeMap[key];
                  if (conversionType) {
                    await db.insert(conversions).values({
                      sessionId: sessionId || null,
                      email: customerEmail || null,
                      name: customerName || null,
                      type: conversionType as any,
                      amount: paymentIntent.amount,
                    });
                  }
                }

                // Mark quiz session as converted
                if (sessionId && keys.includes("main_offer")) {
                  await db.update(quizSessions)
                    .set({ status: "converted" })
                    .where(eq(quizSessions.sessionId, sessionId));
                }
              }
            }

            // --- Send post-purchase notification to owner ---
            const purchasedItems = (productKeys || "").split(",").filter(Boolean);
            const itemNames = purchasedItems
              .map((k: string) => PRODUCTS[k as ProductKey]?.name || k)
              .join(", ");
            const totalBRL = (paymentIntent.amount / 100).toFixed(2).replace(".", ",");

            await notifyOwner({
              title: `Nova venda: R$${totalBRL}`,
              content: [
                `Cliente: ${customerName || "N/A"} (${customerEmail || "N/A"})`,
                `Produtos: ${itemNames}`,
                `Valor total: R$${totalBRL}`,
                `Método: ${paymentIntent.payment_method_types?.join(", ") || "card"}`,
                `Session ID: ${sessionId || "N/A"}`,
                `Payment Intent: ${paymentIntent.id}`,
              ].join("\n"),
            }).catch((err: any) => {
              console.warn("[Stripe Webhook] Failed to notify owner:", err.message);
            });

            // --- Send confirmation email to customer via Stripe receipt ---
            // Stripe automatically sends receipts when email_receipt is set on the charge
            if (customerEmail && paymentIntent.latest_charge) {
              try {
                await stripe.charges.update(paymentIntent.latest_charge as string, {
                  receipt_email: customerEmail,
                  metadata: {
                    products: itemNames,
                    customer_name: customerName || "",
                  },
                });
                console.log(`[Stripe Webhook] Receipt email queued for ${customerEmail}`);
              } catch (receiptErr: any) {
                console.warn("[Stripe Webhook] Failed to set receipt email:", receiptErr.message);
              }
            }

            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err: any) {
        console.error(`[Stripe Webhook] Error processing ${event.type}:`, err.message);
      }

      res.json({ received: true });
    }
  );
}
