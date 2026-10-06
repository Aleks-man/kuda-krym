import { describe, expect, it } from "vitest";
import { recommendationResponseFixture } from "../../../../../../tests/e2e/fixtures/recommendation-response";
import { parseRecommendationSession, recommendationResultLifetime } from "./recommendation-session";
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
