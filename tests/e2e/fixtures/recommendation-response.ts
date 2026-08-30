import type { RecommendationResponse } from "@kuda-krym/contracts";

export const recommendationResponseFixture = {
  data: [
    {
      position: 1,
      beach: {
        id: "f1f7c831-965f-46bb-9d34-2265ea080c72",
        slug: "yalta-primorsky-beach",
        name: "Приморский пляж Ялты",
        coordinates: { latitude: 44.495, longitude: 34.166 },
        surface: "PEBBLE",
        childSuitability: "UNKNOWN",
      },
      score: 87,
      rawScore: 89,
      confidencePercent: 92,
      hourCount: 5,
      travel: { distanceMeters: 8_400, durationMinutes: 18 },
      components: [
        { name: "SEA", score: 91, coveragePercent: 100, weight: 0.5 },
        { name: "WEATHER", score: 84, coveragePercent: 100, weight: 0.3 },
        { name: "WARM_WATER", score: 88, coveragePercent: 100, weight: 0.2 },
      ],
      conditions: {
        airTemperatureCelsius: 27,
        seaSurfaceTemperatureCelsius: 24,
        waveHeightMeters: 0.3,
        windSpeedMetersPerSecond: 2.8,
        precipitationProbabilityPercent: 5,
      },
    },
  ],
  context: {
    origin: {
      code: "yalta",
      name: "Ялта",
      coordinates: { latitude: 44.495, longitude: 34.166 },
    },
    date: "2026-08-31",
    visitWindow: {
      startsAt: "2026-08-31T06:00:00.000Z",
      endsAt: "2026-08-31T10:00:00.000Z",
    },
    priority: "WARM_WATER",
    maxTravelMinutes: 60,
  },
  meta: {
    candidateCount: 12,
    recommendationCount: 1,
    unavailableCount: 0,
  },
} satisfies RecommendationResponse;
