import { describe, expect, it } from "vitest";

import {
  apiErrorSchema,
  beachDetailSchema,
  beachForecastSchema,
  beachListResponseSchema,
  healthResponseSchema,
} from "../src/index.js";

describe("API contracts", () => {
  it("accepts a combined beach forecast", () => {
    const result = beachForecastSchema.parse({
      beach: {
        id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
        slug: "uchkuevka",
        name: "Пляж Учкуевка",
        coordinates: { latitude: 44.644844, longitude: 33.536119 },
      },
      timezone: "UTC",
      generatedAt: "2026-08-20T08:05:00.000Z",
      hourly: [
        {
          time: "2026-08-20T10:00",
          weather: {
            temperatureCelsius: 27.1,
            precipitationProbabilityPercent: 5,
            precipitationMillimeters: 0,
            windSpeedMetersPerSecond: 3.2,
            windDirectionDegrees: 240,
            windGustMetersPerSecond: 5.1,
            cloudCoverPercent: 12,
          },
          marine: {
            seaSurfaceTemperatureCelsius: 25.6,
            waveHeightMeters: 0.32,
            waveDirectionDegrees: 225,
            wavePeriodSeconds: 3.8,
          },
        },
      ],
    });

    expect(result.hourly).toHaveLength(1);
  });

  it("accepts a valid health response", () => {
    expect(healthResponseSchema.parse({ status: "ok" })).toEqual({
      status: "ok",
    });
  });

  it("rejects an empty API error code", () => {
    const result = apiErrorSchema.safeParse({
      error: { code: "", message: "Request failed" },
    });

    expect(result.success).toBe(false);
  });

  it("accepts a beach list response", () => {
    const result = beachListResponseSchema.parse({
      data: [
        {
          id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
          slug: "uchkuevka",
          name: "Пляж Учкуевка",
          region: "SEVASTOPOL",
          locality: "Севастополь",
          coordinates: { latitude: 44.644844, longitude: 33.536119 },
          surface: "UNKNOWN",
          childSuitability: "UNKNOWN",
          coverImageUrl: null,
        },
      ],
      meta: { total: 1 },
    });

    expect(result.meta.total).toBe(1);
  });

  it("accepts beach details with transparent unknown values", () => {
    const result = beachDetailSchema.parse({
      id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
      slug: "uchkuevka",
      name: "Пляж Учкуевка",
      officialName: "Учкуевка",
      description: null,
      region: "SEVASTOPOL",
      locality: "Севастополь",
      coordinates: { latitude: 44.644844, longitude: 33.536119 },
      surface: "UNKNOWN",
      childSuitability: "UNKNOWN",
      coverImageUrl: null,
      profile: {
        waterEntry: "UNKNOWN",
        childSuitability: "UNKNOWN",
        infrastructure: "UNKNOWN",
        parking: "UNKNOWN",
        accessibility: "UNKNOWN",
        bayProtection: "UNKNOWN",
        hasToilet: "UNKNOWN",
        hasShower: "UNKNOWN",
        hasChangingRoom: "UNKNOWN",
      },
      images: [],
      sources: [
        {
          field: "COORDINATES",
          title: "OpenStreetMap: Учкуевка",
          url: "https://www.openstreetmap.org/way/130042680",
          status: "MANUALLY_CHECKED",
          verifiedAt: "2026-08-20T00:00:00.000Z",
        },
      ],
    });

    expect(result.profile.parking).toBe("UNKNOWN");
  });
});

