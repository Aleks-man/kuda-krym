import { coastalForecastSchema } from "@kuda-krym/contracts";
import request from "supertest";
import { describe, expect, it } from "vitest";

import { createTestApp } from "./support/create-test-app.js";

const yalta = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  slug: "yalta",
  name: "Ялта",
  region: "SOUTH_COAST",
  waterBody: "BLACK_SEA",
  weatherCoordinates: { latitude: 44.495, longitude: 34.166 },
  marineCoordinates: { latitude: 44.46, longitude: 34.17 },
} as const;

describe("GET /api/coastal-locations/:slug/forecast", () => {
  it("combines weather and marine conditions for a coastal location", async () => {
    const response = await request(
      createTestApp({
        coastalLocations: [yalta],
        weatherForecast: {
          location: yalta.weatherCoordinates,
          timezone: "UTC",
          generatedAt: "2026-08-20T08:00:00.000Z",
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
          ],
        },
        marineForecast: {
          location: yalta.marineCoordinates,
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
      }),
    ).get("/api/coastal-locations/yalta/forecast?days=1");

    const body = coastalForecastSchema.parse(response.body);
    expect(response.status).toBe(200);
    expect(body.location.slug).toBe("yalta");
    expect(body.hourly[0]?.marine.waveHeightMeters).toBe(0.32);
    expect(body.hourly[0]?.scores.sea.score).toBeGreaterThan(90);
    expect(body.hourly[0]?.confidence.factors).toHaveLength(3);
  });

  it("returns 404 for an unavailable coastal location", async () => {
    const response = await request(createTestApp()).get(
      "/api/coastal-locations/unknown/forecast",
    );

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("COASTAL_LOCATION_NOT_FOUND");
  });

  it("returns 400 for invalid forecast days", async () => {
    const response = await request(
      createTestApp({ coastalLocations: [yalta] }),
    ).get("/api/coastal-locations/yalta/forecast?days=7");

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe(
      "INVALID_COASTAL_FORECAST_REQUEST",
    );
  });
});
