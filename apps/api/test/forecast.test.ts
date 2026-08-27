import { beachForecastSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

const beachId = "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4";

describe("GET /api/forecast/:beachId", () => {
  it("combines weather and marine conditions by time", async () => {
    const app = createTestApp({
      forecastBeach: {
        id: beachId,
        slug: "uchkuevka",
        name: "Пляж Учкуевка",
        latitude: 44.644844,
        longitude: 33.536119,
      },
      weatherForecast: {
        location: { latitude: 44.65, longitude: 33.53 },
        timezone: "UTC",
        generatedAt: "2026-08-20T08:00:00.000Z",
        freshness: {
          status: "FRESH",
          generatedAt: "2026-08-20T08:00:00.000Z",
        },
        hourly: [
          {
            time: "2026-08-20T10:00",
            temperatureCelsius: 27.1,
            precipitationProbabilityPercent: 5,
            precipitationMillimeters: 0,
            windSpeedMetersPerSecond: 3.2,
            windDirectionDegrees: 240,
            windGustMetersPerSecond: 5.1,
            cloudCoverPercent: 12,
          },
          {
            time: "2026-08-20T11:00",
            temperatureCelsius: 27.8,
            precipitationProbabilityPercent: 10,
            precipitationMillimeters: 0.1,
            windSpeedMetersPerSecond: 3.8,
            windDirectionDegrees: 245,
            windGustMetersPerSecond: 5.8,
            cloudCoverPercent: 18,
          },
        ],
      },
      marineForecast: {
        location: { latitude: 44.625, longitude: 33.54167 },
        timezone: "UTC",
        generatedAt: "2026-08-20T08:00:00.000Z",
        hourly: [
          {
            time: "2026-08-20T10:00",
            seaSurfaceTemperatureCelsius: 25.6,
            waveHeightMeters: 0.32,
            waveDirectionDegrees: 225,
            wavePeriodSeconds: 3.8,
          },
        ],
      },
      weatherModelComparison: {
        location: { latitude: 44.644844, longitude: 33.536119 },
        generatedAt: "2026-08-20T08:00:00.000Z",
        freshness: {
          status: "FRESH",
          generatedAt: "2026-08-20T08:00:00.000Z",
        },
        models: {
          available: ["ECMWF_IFS", "DWD_ICON", "NOAA_GFS"],
          failures: [],
        },
        hourly: [
          {
            time: "2026-08-20T10:00",
            samples: [],
            agreement: {
              modelCount: 3,
              score: 88,
              level: "HIGH",
              factors: [],
            },
          },
        ],
      },
    });

    const response = await request(app).get(`/api/forecast/${beachId}?days=1`);
    const body = beachForecastSchema.parse(response.body);

    expect(response.status).toBe(200);
    expect(body.beach.slug).toBe("uchkuevka");
    expect(body.hourly[0]?.marine.waveHeightMeters).toBe(0.32);
    expect(body.hourly[0]?.scores.sea.score).toBeGreaterThan(90);
    expect(body.hourly[0]?.scores.sea.coveragePercent).toBe(100);
    expect(body.hourly[0]?.scores.weather.score).toBeGreaterThan(90);
    expect(body.hourly[0]?.confidence).toMatchObject({
      score: expect.any(Number),
      level: expect.stringMatching(/^(LOW|MEDIUM|HIGH)$/),
    });
    expect(body.hourly[0]?.confidence.factors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "MODEL_AGREEMENT", score: 88 }),
      ]),
    );
    expect(body.hourly[1]?.confidence.factors).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "MODEL_AGREEMENT" }),
      ]),
    );
    expect(body.hourly[1]?.marine.waveHeightMeters).toBeNull();
    expect(body.hourly[1]?.scores.sea.coveragePercent).toBe(40);
    expect(body.hourly[1]?.scores.sea.factors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "waveHeight", score: null }),
        expect.objectContaining({ name: "windSpeed", score: expect.any(Number) }),
      ]),
    );
  });

  it("returns 404 when a published beach does not exist", async () => {
    const response = await request(createTestApp()).get(
      `/api/forecast/${beachId}`,
    );

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("BEACH_NOT_FOUND");
  });

  it("returns 400 for invalid request parameters", async () => {
    const response = await request(createTestApp()).get(
      "/api/forecast/not-a-uuid?days=7",
    );

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("INVALID_FORECAST_REQUEST");
  });
});
