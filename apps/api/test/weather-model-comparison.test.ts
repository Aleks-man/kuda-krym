import { weatherModelComparisonResponseSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

describe("GET /api/weather/model-comparison", () => {
  it("returns a normalized model comparison", async () => {
    const response = await request(
      createTestApp({
        weatherModelComparison: {
          location: { latitude: 0, longitude: 0 },
          generatedAt: "2026-08-26T08:05:00.000Z",
          freshness: {
            status: "FRESH",
            generatedAt: "2026-08-26T08:00:00.000Z",
          },
          models: {
            available: ["ECMWF_IFS", "NOAA_GFS"],
            failures: [
              { model: "DWD_ICON", code: "MODEL_UNAVAILABLE" },
            ],
          },
          hourly: [],
        },
      }),
    ).get(
      "/api/weather/model-comparison?latitude=44.495&longitude=34.166&days=2",
    );

    const body = weatherModelComparisonResponseSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.location).toEqual({ latitude: 44.495, longitude: 34.166 });
    expect(body.models.available).toEqual(["ECMWF_IFS", "NOAA_GFS"]);
    expect(body.models.failures[0]?.model).toBe("DWD_ICON");
  });

  it("returns 400 for invalid coordinates or days", async () => {
    const response = await request(createTestApp()).get(
      "/api/weather/model-comparison?latitude=144&longitude=34&days=7",
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(
      "INVALID_WEATHER_MODEL_COMPARISON_REQUEST",
    );
  });
});
