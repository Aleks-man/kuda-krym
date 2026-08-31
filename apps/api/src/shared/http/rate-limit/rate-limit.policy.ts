import type { AppEnv } from "../../../config/env.js";

export type RateLimitPolicy = Readonly<{
  identifier: string;
  maxRequests: number;
  windowMs: number;
}>;

type RateLimitEnv = Pick<
  AppEnv,
  | "RATE_LIMIT_EXPENSIVE_MAX_REQUESTS"
  | "RATE_LIMIT_MAX_REQUESTS"
  | "RATE_LIMIT_WINDOW_SECONDS"
>;

export function createRateLimitPolicies(env: RateLimitEnv) {
  const windowMs = env.RATE_LIMIT_WINDOW_SECONDS * 1_000;

  return {
    global: {
      identifier: "api",
      maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
      windowMs,
    },
    expensive: {
      identifier: "expensive-api",
      maxRequests: env.RATE_LIMIT_EXPENSIVE_MAX_REQUESTS,
      windowMs,
    },
  } satisfies Record<string, RateLimitPolicy>;
}
