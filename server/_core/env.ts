function requireEnv(key: string, minLength = 0): string {
  const value = process.env[key] ?? "";
  if (!value || value.length < minLength) {
    throw new Error(
      `[ENV] Missing or invalid required environment variable: ${key}${minLength > 0 ? ` (minimum ${minLength} characters)` : ""}`
    );
  }
  return value;
}

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

export function validateCriticalEnv() {
  if (ENV.isProduction) {
    requireEnv("JWT_SECRET", 32);
    requireEnv("STRIPE_WEBHOOK_SECRET", 10);
    requireEnv("STRIPE_SECRET_KEY", 10);
  } else {
    if (!process.env.JWT_SECRET) {
      console.warn("[ENV] WARNING: JWT_SECRET not set — auth will use empty key in development");
    }
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn("[ENV] WARNING: STRIPE_WEBHOOK_SECRET not set — Stripe webhooks will fail");
    }
  }
}
