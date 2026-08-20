import { healthResponseSchema } from "@kuda-krym/contracts";
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
});

