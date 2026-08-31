import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createRateLimitMiddleware } from "../../../src/shared/http/rate-limit/rate-limit.middleware.js";

describe("rate limit middleware", () => {
  it("returns a structured 429 response after the configured limit", async () => {
    const app = express();
    app.use(
      createRateLimitMiddleware({
        identifier: "test-api",
        maxRequests: 2,
        windowMs: 60_000,
      }),
    );
    app.get("/resource", (_request, response) => {
      response.status(200).json({ status: "ok" });
    });

    await request(app).get("/resource").expect(200);
    await request(app).get("/resource").expect(200);
    const limited = await request(app).get("/resource").expect(429);

    expect(limited.body).toEqual({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Слишком много запросов. Попробуйте снова немного позже.",
      },
    });
    expect(limited.headers).toHaveProperty("ratelimit");
    expect(limited.headers).toHaveProperty("retry-after");
    expect(limited.headers).not.toHaveProperty("x-ratelimit-limit");
  });
});
