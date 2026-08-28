import {
  healthResponseSchema,
  readinessResponseSchema,
} from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

describe("GET /api/health", () => {
  it("reports that the API is available", async () => {
    const app = createTestApp();

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(healthResponseSchema.parse(response.body)).toEqual({ status: "ok" });
  });

  it("keeps a dedicated liveness endpoint", async () => {
    const response = await request(createTestApp()).get("/api/health/live");

    expect(response.status).toBe(200);
    expect(healthResponseSchema.parse(response.body)).toEqual({ status: "ok" });
  });

  it("reports that the API is ready when PostgreSQL is available", async () => {
    const response = await request(createTestApp()).get("/api/health/ready");

    expect(response.status).toBe(200);
    expect(readinessResponseSchema.parse(response.body)).toEqual({
      status: "ready",
      checks: { database: "up" },
    });
  });

  it("returns 503 when PostgreSQL is unavailable", async () => {
    const response = await request(createTestApp({ databaseReady: false })).get(
      "/api/health/ready",
    );

    expect(response.status).toBe(503);
    expect(readinessResponseSchema.parse(response.body)).toEqual({
      status: "not_ready",
      checks: { database: "down" },
    });
  });
});

