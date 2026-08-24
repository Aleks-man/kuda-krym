import { recommendationResponseSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { UnsupportedRecommendationDateError } from "../src/modules/recommendations/context/recommendation-context.error.js";
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
  it("returns a recommendation calculation", async () => {
    const response = await request(createTestApp())
      .post("/api/recommendations")
      .send(validRequest);

    expect(response.status).toBe(200);
    expect(recommendationResponseSchema.parse(response.body)).toMatchObject({
      data: [],
      meta: {
        candidateCount: 0,
        recommendationCount: 0,
        unavailableCount: 0,
      },
    });
  });

  it("rejects a date outside today and tomorrow", async () => {
    const response = await request(
      createTestApp({
        recommendationError: new UnsupportedRecommendationDateError(
          "2026-08-22",
        ),
      }),
    )
      .post("/api/recommendations")
      .send(validRequest);

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("UNSUPPORTED_RECOMMENDATION_DATE");
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
