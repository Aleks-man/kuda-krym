import { describe, expect, it } from "vitest";

import {
  apiErrorSchema,
  beachDetailSchema,
  beachForecastSchema,
  beachListResponseSchema,
  healthResponseSchema,
  recommendationRequestSchema,
  recommendationResponseSchema,
  routeRequestSchema,
  routeResponseSchema,
} from "../src/index.js";

describe("API contracts", () => {
  it("accepts a driving route calculation", () => {
    const request = routeRequestSchema.parse({
      origin: { latitude: 44.9521, longitude: 34.1024 },
      beachId: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
    });
    const response = routeResponseSchema.parse({
      data: {
        origin: request.origin,
        destination: { latitude: 44.644844, longitude: 33.536119 },
        distanceMeters: 78240,
        durationSeconds: 4380,
        geometry: {
          type: "LineString",
          coordinates: [
            [34.1024, 44.9521],
            [33.536119, 44.644844],
          ],
        },
      },
      meta: {
        source: "OSRM",
        calculatedAt: "2026-08-24T09:30:00.000Z",
        cached: false,
      },
    });

    expect(request.profile).toBe("DRIVING");
    expect(response.data.durationSeconds).toBe(4380);
  });

  it("rejects an invalid route origin", () => {
    const result = routeRequestSchema.safeParse({
      origin: { latitude: 144.9521, longitude: 34.1024 },
      beachId: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
    });

    expect(result.success).toBe(false);
  });

  it("accepts an empty recommendation response", () => {
    const result = recommendationResponseSchema.parse({
      data: [],
      context: {
        origin: { code: "simferopol", name: "Симферополь" },
        date: "2026-08-20",
        visitWindow: {
          startsAt: "2026-08-20T09:00:00.000Z",
          endsAt: "2026-08-20T14:00:00.000Z",
        },
        priority: "CALM_SEA",
        maxTravelMinutes: 120,
      },
      meta: {
        candidateCount: 0,
        recommendationCount: 0,
        unavailableCount: 0,
      },
    });

    expect(result.data).toEqual([]);
  });

  it("accepts an averaged fractional ranking component", () => {
    const result = recommendationResponseSchema.parse({
      data: [
        {
          position: 1,
          beach: {
            id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
            slug: "uchkuevka",
            name: "Пляж Учкуевка",
            coordinates: { latitude: 44.644844, longitude: 33.536119 },
            surface: "SAND",
            childSuitability: "SUITABLE",
          },
          score: 92,
          rawScore: 94,
          confidencePercent: 95,
          hourCount: 6,
          travel: { distanceMeters: 78_240, durationMinutes: 73 },
          components: [
            {
              name: "SEA",
              score: 94.5,
              coveragePercent: 90,
              weight: 0.65,
            },
          ],
          conditions: {
            airTemperatureCelsius: 26.2,
            seaSurfaceTemperatureCelsius: 25.4,
            waveHeightMeters: 0.3,
            windSpeedMetersPerSecond: 2.8,
            precipitationProbabilityPercent: 5,
          },
        },
      ],
      context: {
        origin: { code: "simferopol", name: "Симферополь" },
        date: "2026-08-24",
        visitWindow: {
          startsAt: "2026-08-24T09:00:00.000Z",
          endsAt: "2026-08-24T14:00:00.000Z",
        },
        priority: "CALM_SEA",
        maxTravelMinutes: 120,
      },
      meta: {
        candidateCount: 1,
        recommendationCount: 1,
        unavailableCount: 0,
      },
    });

    expect(result.data[0]?.components[0]?.score).toBe(94.5);
  });


  it("accepts recommendation preferences", () => {
    const result = recommendationRequestSchema.parse({
      origin: "simferopol",
      date: "2026-08-20",
      time: "day",
      company: "children",
      surface: "sand",
      priority: "calm_sea",
      maxTravelMinutes: 120,
    });

    expect(result.priority).toBe("calm_sea");
    expect(result.maxTravelMinutes).toBe(120);
  });

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
          scores: {
            sea: {
              score: 96,
              coveragePercent: 100,
              factors: [
                { name: "waveHeight", score: 98, weight: 0.4 },
                { name: "windSpeed", score: 99, weight: 0.3 },
                { name: "waterTemperature", score: 96, weight: 0.2 },
                { name: "windGust", score: 88, weight: 0.1 },
              ],
            },
            weather: {
              score: 95,
              coveragePercent: 100,
              factors: [
                { name: "airTemperature", score: 96, weight: 0.4 },
                {
                  name: "precipitationProbability",
                  score: 98,
                  weight: 0.3,
                },
                { name: "precipitationAmount", score: 100, weight: 0.2 },
                { name: "cloudCover", score: 94, weight: 0.1 },
              ],
            },
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

