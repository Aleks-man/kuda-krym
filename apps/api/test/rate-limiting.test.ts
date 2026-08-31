import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

const routeRequest = {
  origin: { latitude: 44.9521, longitude: 34.1024 },
  beachId: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  profile: "DRIVING",
};

const recommendationRequest = {
  origin: "simferopol",
  date: "2026-08-20",
  time: "day",
  company: "children",
  surface: "sand",
  priority: "calm_sea",
  maxTravelMinutes: 120,
};

describe("API rate limiting", () => {
  it("keeps health checks outside the global request budget", async () => {
    const app = createTestApp({
      environment: {
        RATE_LIMIT_MAX_REQUESTS: "1",
        RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: "1",
      },
    });

    await request(app).get("/api/health/live").expect(200);
    await request(app).get("/api/health/ready").expect(200);
    await request(app).get("/api/beaches").expect(200);

    const limited = await request(app).get("/api/beaches").expect(429);
    expect(limited.body.error.code).toBe("RATE_LIMIT_EXCEEDED");
  });

  it("shares a strict budget across expensive endpoints", async () => {
    const app = createTestApp({
      environment: {
        RATE_LIMIT_MAX_REQUESTS: "10",
        RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: "1",
      },
    });

    await request(app).post("/api/routes").send(routeRequest).expect(404);
    const limited = await request(app)
      .post("/api/recommendations")
      .send(recommendationRequest)
      .expect(429);

    expect(limited.body.error.code).toBe("RATE_LIMIT_EXCEEDED");
  });

  it("keeps separate budgets for clients behind a trusted proxy", async () => {
    const app = createTestApp({
      environment: {
        RATE_LIMIT_MAX_REQUESTS: "1",
        RATE_LIMIT_EXPENSIVE_MAX_REQUESTS: "1",
        TRUST_PROXY_HOPS: "1",
      },
    });

    await request(app)
      .get("/api/beaches")
      .set("x-forwarded-for", "198.51.100.10")
      .expect(200);
    await request(app)
      .get("/api/beaches")
      .set("x-forwarded-for", "198.51.100.11")
      .expect(200);
    await request(app)
      .get("/api/beaches")
      .set("x-forwarded-for", "198.51.100.10")
      .expect(429);
  });
});
