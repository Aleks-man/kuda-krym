import { describe, expect, it } from "vitest";

import {
  formatRecommendationDate,
  parseRelativeRecommendationDate,
  resolveRecommendationDate,
} from "./crimea-date";

const now = new Date("2026-09-07T08:00:00.000Z");

describe("recommendation dates", () => {
  it.each([
    ["today", "2026-09-07"],
    ["tomorrow", "2026-09-08"],
    ["dayAfterTomorrow", "2026-09-09"],
  ] as const)("resolves %s in the Crimea calendar", (relativeDate, expected) => {
    expect(resolveRecommendationDate(relativeDate, now)).toBe(expected);
  });

  it("formats a compact date for a choice card", () => {
    expect(formatRecommendationDate("dayAfterTomorrow", now)).toBe(
      "9 сентября",
    );
  });

  it("rejects an unknown relative date", () => {
    expect(() => parseRelativeRecommendationDate("nextWeek")).toThrow(
      "Выберите день поездки",
    );
  });
});
