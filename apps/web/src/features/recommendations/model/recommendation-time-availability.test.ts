import { describe, expect, it } from "vitest";

import {
  getFirstAvailableRecommendationTime,
  getUnavailableRecommendationTimes,
  isTodayUnavailable,
} from "./recommendation-time-availability";

function atCrimeaTime(hours: number, minutes = 0) {
  return new Date(`2026-09-07T${String(hours - 3).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00.000Z`);
}

describe("recommendation time availability", () => {
  it("keeps a window available while at least one hour remains", () => {
    expect(
      getUnavailableRecommendationTimes("today", atCrimeaTime(11, 59)),
    ).not.toContain("morning");
  });

  it("disables a window one hour before it ends", () => {
    expect(
      getUnavailableRecommendationTimes("today", atCrimeaTime(12)),
    ).toContain("morning");
    expect(
      getUnavailableRecommendationTimes("today", atCrimeaTime(16)),
    ).toContain("day");
  });

  it("keeps future dates fully available", () => {
    expect(
      getUnavailableRecommendationTimes("tomorrow", atCrimeaTime(23)),
    ).toEqual(new Set());
  });

  it("disables today only when every window has less than one hour left", () => {
    expect(isTodayUnavailable(atCrimeaTime(18, 59))).toBe(false);
    expect(isTodayUnavailable(atCrimeaTime(19))).toBe(true);
  });

  it("selects the next usable window", () => {
    expect(getFirstAvailableRecommendationTime("today", atCrimeaTime(12))).toBe(
      "day",
    );
  });
});
