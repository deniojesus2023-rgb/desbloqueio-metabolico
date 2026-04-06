import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { quizSessions, quizAnswers, conversions } from "../drizzle/schema";
import { eq, desc, count, sql, and, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  quiz: router({
    startSession: publicProcedure
      .input(z.object({
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmCampaign: z.string().optional(),
        country: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const sessionId = nanoid(16);
        await db.insert(quizSessions).values({
          sessionId,
          status: "started",
          currentQuestion: 0,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmCampaign: input.utmCampaign,
          country: input.country,
        });
        return { sessionId };
      }),

    saveAnswer: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        questionIndex: z.number(),
        questionText: z.string(),
        answerIndex: z.number(),
        answerText: z.string(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(quizAnswers).values({
          sessionId: input.sessionId,
          questionIndex: input.questionIndex,
          questionText: input.questionText,
          answerIndex: input.answerIndex,
          answerText: input.answerText,
        });
        await db.update(quizSessions)
          .set({ currentQuestion: input.questionIndex + 1 })
          .where(eq(quizSessions.sessionId, input.sessionId));
        return { success: true };
      }),

    completeQuiz: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        name: z.string(),
        email: z.string().email(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.update(quizSessions)
          .set({
            name: input.name,
            email: input.email,
            status: "completed",
            completedAt: new Date(),
          })
          .where(eq(quizSessions.sessionId, input.sessionId));
        return { success: true };
      }),

    trackConversion: publicProcedure
      .input(z.object({
        sessionId: z.string().optional(),
        email: z.string().email().optional(),
        name: z.string().optional(),
        type: z.enum(["main_offer", "order_bump", "upsell_1", "downsell_1", "upsell_2"]),
        amount: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        await db.insert(conversions).values({
          sessionId: input.sessionId,
          email: input.email,
          name: input.name,
          type: input.type,
          amount: input.amount,
        });
        if (input.sessionId && input.type === "main_offer") {
          await db.update(quizSessions)
            .set({ status: "converted" })
            .where(eq(quizSessions.sessionId, input.sessionId));
        }
        return { success: true };
      }),
  }),

  admin: router({
    getStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const [totalSessions] = await db.select({ count: count() }).from(quizSessions);
        const [completedSessions] = await db.select({ count: count() })
          .from(quizSessions).where(eq(quizSessions.status, "completed"));
        const [convertedSessions] = await db.select({ count: count() })
          .from(quizSessions).where(eq(quizSessions.status, "converted"));
        const [totalRevenue] = await db.select({ total: sql<number>`sum(amount)` })
          .from(conversions).where(eq(conversions.type, "main_offer"));

        const completionRate = totalSessions.count > 0
          ? Math.round((completedSessions.count / totalSessions.count) * 100) : 0;
        const conversionRate = completedSessions.count > 0
          ? Math.round((convertedSessions.count / completedSessions.count) * 100) : 0;

        return {
          totalSessions: totalSessions.count,
          completedSessions: completedSessions.count,
          convertedSessions: convertedSessions.count,
          completionRate,
          conversionRate,
          totalRevenue: totalRevenue.total || 0,
        };
      }),

    getLeads: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return db.select().from(quizSessions)
          .orderBy(desc(quizSessions.createdAt))
          .limit(input.limit).offset(input.offset);
      }),

    getFunnelData: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");

        const [started] = await db.select({ count: count() }).from(quizSessions);
        const [completed] = await db.select({ count: count() })
          .from(quizSessions).where(eq(quizSessions.status, "completed"));
        const [converted] = await db.select({ count: count() })
          .from(quizSessions).where(eq(quizSessions.status, "converted"));
        const [orderBumps] = await db.select({ count: count() })
          .from(conversions).where(eq(conversions.type, "order_bump"));
        const [upsells] = await db.select({ count: count() })
          .from(conversions).where(eq(conversions.type, "upsell_1"));

        return [
          { label: "Visitantes del Quiz", value: started.count },
          { label: "Completaron el Quiz", value: completed.count },
          { label: "Compraron (Oferta Principal)", value: converted.count },
          { label: "Order Bump", value: orderBumps.count },
          { label: "Upsell 1", value: upsells.count },
        ];
      }),

    getAnswerStats: protectedProcedure
      .input(z.object({ questionIndex: z.number() }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        return db.select({
          answerText: quizAnswers.answerText,
          count: count(),
        })
          .from(quizAnswers)
          .where(eq(quizAnswers.questionIndex, input.questionIndex))
          .groupBy(quizAnswers.answerText);
      }),

    getDropoffStats: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        // Count how many sessions reached each question (currentQuestion = last answered + 1)
        const rows = await db.select({
          currentQuestion: quizSessions.currentQuestion,
          count: count(),
        })
          .from(quizSessions)
          .groupBy(quizSessions.currentQuestion);
        // Build cumulative drop-off: sessions that reached question N = sum of sessions where currentQuestion >= N
        const totalByQuestion: Record<number, number> = {};
        rows.forEach(r => {
          const q = r.currentQuestion ?? 0;
          for (let i = 0; i <= q; i++) {
            totalByQuestion[i] = (totalByQuestion[i] || 0) + r.count;
          }
        });
        const QUESTION_LABELS = [
          "P1: Resultado desejado",
          "P2: País",
          "P3: Frustração principal",
          "P4: Força de vontade",
          "P5: Nível de estresse",
          "P6: O que não abandonaria",
          "P7: Enfoque diferente",
          "P8: Truque de 3 min",
          "P9: Prazo para resultados",
          "P10: Gasto anterior",
        ];
        return QUESTION_LABELS.map((label, idx) => ({
          question: label,
          reached: totalByQuestion[idx] || 0,
        }));
      }),

    getRevenueByType: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const rows = await db.select({
          type: conversions.type,
          total: sql<number>`sum(amount)`,
          count: count(),
        })
          .from(conversions)
          .groupBy(conversions.type);
        const LABELS: Record<string, string> = {
          main_offer: "Oferta Principal ($27)",
          order_bump: "Order Bump ($9.90)",
          upsell_1: "Upsell 1 ($47)",
          downsell_1: "Downsell ($17)",
          upsell_2: "Upsell 2 ($27)",
        };
        return rows.map(r => ({
          type: r.type,
          label: LABELS[r.type] || r.type,
          total: (r.total || 0) / 100,
          count: r.count,
        }));
      }),

    getStatsByCountry: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const rows = await db.select({
          country: quizSessions.country,
          count: count(),
        })
          .from(quizSessions)
          .groupBy(quizSessions.country);
        return rows.filter(r => r.country).sort((a, b) => b.count - a.count);
      }),

    getLeadsFiltered: protectedProcedure
      .input(z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
        country: z.string().optional(),
        dateFrom: z.string().optional(),
        dateTo: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user?.role !== "admin") throw new Error("Unauthorized");
        const db = await getDb();
        if (!db) throw new Error("Database unavailable");
        const conditions = [];
        if (input.country) conditions.push(eq(quizSessions.country, input.country));
        if (input.dateFrom) conditions.push(gte(quizSessions.createdAt, new Date(input.dateFrom)));
        if (input.dateTo) conditions.push(lte(quizSessions.createdAt, new Date(input.dateTo)));
        const query = db.select().from(quizSessions)
          .orderBy(desc(quizSessions.createdAt))
          .limit(input.limit)
          .offset(input.offset);
        if (conditions.length > 0) {
          return query.where(and(...conditions));
        }
        return query;
      }),
  }),
});

export type AppRouter = typeof appRouter;
