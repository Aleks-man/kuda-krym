import { cityForecastSchema, inlandForecastLocations } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

describe("GET /api/cities/:slug/forecast", () => {
  it.each(inlandForecastLocations)("returns a weather-only forecast for $name", async (city) => {
    const response = await request(createTestApp({
      weatherForecast: {
        location: city.coordinates,
        timezone: "UTC",
        generatedAt: "2026-08-20T08:00:00.000Z",
        hourly: [{
          time: "2026-08-20T10:00",
          temperatureCelsius: 27.1,
          precipitationProbabilityPercent: 5,
          precipitationMillimeters: 0,
          windSpeedMetersPerSecond: 3.2,
          windDirectionDegrees: 240,
          windGustMetersPerSecond: 5.1,
          cloudCoverPercent: 12,
        }],
      },
    })).get(`/api/cities/${city.slug}/forecast?days=7`);

    const body = cityForecastSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.city).toEqual({ slug: city.slug, name: city.name, coordinates: city.coordinates });
    expect(body.freshness.sources.marine).toBeNull();
    expect(body.hourly[0]?.marine).toEqual({
      seaSurfaceTemperatureCelsius: null,
      waveHeightMeters: null,
      waveDirectionDegrees: null,
      wavePeriodSeconds: null,
    });
    expect(body.hourly[0]?.scores.weather.score).toBeGreaterThan(90);
    expect(body.hourly[0]?.confidence.factors).toHaveLength(3);
  });

  it("returns 404 for an unsupported city", async () => {
    const response = await request(createTestApp()).get("/api/cities/unknown/forecast");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("CITY_NOT_FOUND");
  });
});
