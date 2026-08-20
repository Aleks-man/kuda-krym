import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

const validRequest = {
  origin: "simferopol",
  date: "2026-08-20",
  time: "day",
  company: "children",
  surface: "sand",
  priority: "calm_sea",
};

describe("POST /api/recommendations", () => {
  it("accepts the request contract without returning a fake result", async () => {
    const response = await request(createTestApp())
      .post("/api/recommendations")
      .send(validRequest);

    expect(response.status).toBe(501);
    expect(response.body).toEqual({
      error: {
        code: "RECOMMENDATIONS_NOT_READY",
        message: "Расчёт рекомендаций пока не подключён",
      },
    });
  });

  it("rejects unknown preference values", async () => {
    const response = await request(createTestApp())
      .post("/api/recommendations")
      .send({ ...validRequest, priority: "nearest_beach" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_RECOMMENDATION_REQUEST");
  });

  it("rejects missing and additional fields", async () => {
    const { surface: _surface, ...incompleteRequest } = validRequest;
    const response = await request(createTestApp())
      .post("/api/recommendations")
      .send({ ...incompleteRequest, debug: true });

    expect(response.status).toBe(400);
  });
});
