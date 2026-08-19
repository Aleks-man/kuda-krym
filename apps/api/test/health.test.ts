import request from "supertest";
import { describe, expect, it } from "vitest";

import { createApp } from "../src/app.js";
import { parseEnv } from "../src/config/env.js";

describe("GET /api/health", () => {
  it("reports that the API is available", async () => {
    const app = createApp(parseEnv({ NODE_ENV: "test" }));

    const response = await request(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });
});

