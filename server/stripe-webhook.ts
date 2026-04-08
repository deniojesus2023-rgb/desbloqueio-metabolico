import express, { type Express, type Request, type Response } from "express";
import { constructWebhookEvent } from "./stripe";
import { getDb } from "./db";
import { conversions, quizSessions } from "../drizzle/schema";
import { eq } from "drizzle-orm";

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
