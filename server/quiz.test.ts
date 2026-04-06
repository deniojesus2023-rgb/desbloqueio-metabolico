import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock getDb
vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockResolvedValue([]),
          }),
          groupBy: vi.fn().mockResolvedValue([]),
        }),
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  }),
  upsertUser: vi.fn(),
  getUserByOpenId: vi.fn(),
}));

// Mock nanoid
vi.mock("nanoid", () => ({
  nanoid: vi.fn().mockReturnValue("test-session-id-123"),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email: "admin@test.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("quiz.startSession", () => {
  it("should create a new session and return sessionId", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.startSession({});
    expect(result).toHaveProperty("sessionId");
    expect(result.sessionId).toBe("test-session-id-123");
  });

  it("should accept utm parameters", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.startSession({
      utmSource: "facebook",
      utmMedium: "cpc",
      utmCampaign: "latam-test",
    });
    expect(result.sessionId).toBeDefined();
  });
});

describe("quiz.saveAnswer", () => {
  it("should save an answer successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.saveAnswer({
      sessionId: "test-session-id",
      questionIndex: 0,
      questionText: "Test question?",
      answerIndex: 1,
      answerText: "Test answer",
    });
    expect(result).toEqual({ success: true });
  });
});

describe("quiz.completeQuiz", () => {
  it("should complete quiz with valid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.completeQuiz({
      sessionId: "test-session-id",
      name: "María García",
      email: "maria@test.com",
    });
    expect(result).toEqual({ success: true });
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.quiz.completeQuiz({
        sessionId: "test-session-id",
        name: "María García",
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });
});

describe("quiz.trackConversion", () => {
  it("should track main offer conversion", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.quiz.trackConversion({
      sessionId: "test-session-id",
      type: "main_offer",
      amount: 2700,
    });
    expect(result).toEqual({ success: true });
  });
});

describe("admin.getLeads", () => {
  it("should throw for non-admin users", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.admin.getLeads({ limit: 10, offset: 0 })).rejects.toThrow();
  });

  it("should return leads for admin users", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.admin.getLeads({ limit: 10, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
  });
});
