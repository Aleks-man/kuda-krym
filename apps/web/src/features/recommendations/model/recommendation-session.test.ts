import type { RecommendationResponse } from "@kuda-krym/contracts";
import { describe, expect, it } from "vitest";
import { parseRecommendationSession, recommendationResultLifetime } from "./recommendation-session";
const recommendationResponseFixture = {
  data: [
    {
      position: 1,
      beach: {
        id: "f1f7c831-965f-46bb-9d34-2265ea080c72",
        slug: "yalta-primorsky-beach",
        name: "Приморский пляж Ялты",
        coastalLocation: {
          slug: "yalta",
          name: "Ялта",
          coverImage: {
            url: "/images/places/yalta-beach-2016.webp",
            alt: "Побережье Ялты",
            title: "Побережье Ялты",
            author: "Test author",
            license: "CC BY-SA 4.0",
            licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
            sourceUrl: "https://commons.wikimedia.org/",
          },
        },
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

const now = new Date("2026-08-30T09:00:00Z");
const stored = {
  version: 1,
  draft: { originQuery: "Ялта", origin: { id: "popular:yalta", label: "Ялта", context: "Популярное направление", value: "yalta" }, date: "tomorrow", time: "morning", priority: "warm_water", maxTravelMinutes: "90" },
  calendarDate: "2026-08-31", result: recommendationResponseFixture, resultSavedAt: now.getTime(),
};
describe("recommendation session", () => {
  it("restores the draft and valid results", () => {
    const session = parseRecommendationSession(JSON.stringify(stored), now);
    expect(session?.draft).toEqual(stored.draft);
    expect(session?.result).toEqual(recommendationResponseFixture);
  });
  it("preserves the actual trip date across midnight", () => {
    const session = parseRecommendationSession(JSON.stringify(stored), new Date("2026-08-30T21:05:00Z"));
    expect(session?.draft.date).toBe("today");
    expect(session?.calendarDate).toBe("2026-08-31");
  });
  it("keeps the draft but discards expired or invalid results", () => {
    for (const value of [
      { ...stored, resultSavedAt: now.getTime() - recommendationResultLifetime },
      { ...stored, resultSavedAt: now.getTime() + 1 },
      { ...stored, result: { data: [] } },
    ]) {
      const session = parseRecommendationSession(JSON.stringify(value), now);
      expect(session?.draft).toEqual(stored.draft);
      expect(session?.result).toBeNull();
    }
  });
  it("rejects corrupted storage and invalid origins", () => {
    expect(parseRecommendationSession("broken", now)).toBeNull();
    expect(parseRecommendationSession(JSON.stringify({ ...stored, version: 2 }), now)).toBeNull();
    expect(parseRecommendationSession(JSON.stringify({ ...stored, draft: { ...stored.draft, origin: { ...stored.draft.origin, value: "unknown" } } }), now)).toBeNull();
  });
  it("preserves a searched village and its coordinates", () => {
    const origin = { id: "village:ukromnoye", label: "Укромное", context: "Симферопольский район", value: {
      id: "village:ukromnoye", name: "Укромное", context: "Симферопольский район", latitude: 45.051, longitude: 34.003,
    } };
    const session = parseRecommendationSession(JSON.stringify({ ...stored, draft: { ...stored.draft, originQuery: "Укромное", origin } }), now);
    expect(session?.draft.origin).toEqual(origin);
  });
  it("keeps an unfinished origin query without inventing a selected location", () => {
    const session = parseRecommendationSession(JSON.stringify({ ...stored, draft: { ...stored.draft, originQuery: "Нов", origin: null }, result: null }), now);
    expect(session?.draft.originQuery).toBe("Нов");
    expect(session?.draft.origin).toBeNull();
  });
});
