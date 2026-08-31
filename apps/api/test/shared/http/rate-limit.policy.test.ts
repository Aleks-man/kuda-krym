import { describe, expect, it } from "vitest";

import { createRateLimitPolicies } from "../../../src/shared/http/rate-limit/rate-limit.policy.js";

describe("rate limit policies", () => {
  it("maps environment values to global and expensive policies", () => {
    expect(
      createRateLimitPolicies({
        RATE_LIMIT_WINDOW_SECONDS: 90,
        RATE_LIMIT_MAX_REQUESTS: 180,
        RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: 12,
      }),
    ).toEqual({
      global: {
        identifier: "api",
        maxRequests: 180,
        windowMs: 90_000,
      },
      expensive: {
        identifier: "expensive-api",
        maxRequests: 12,
        windowMs: 90_000,
      },
    });
  });
});
