import { describe, expect, it } from "vitest";

import { isCloudCoverRelevant } from "../../src/modules/forecast/is-cloud-cover-relevant.js";

const sunTimes = [
  {
    date: "2026-09-17",
    sunrise: "2026-09-17T03:27",
    sunset: "2026-09-17T15:52",
  },
];

describe("isCloudCoverRelevant", () => {
  it.each([
    ["2026-09-17T02:56", false],
    ["2026-09-17T02:57", true],
    ["2026-09-17T03:27", true],
    ["2026-09-17T12:00", true],
    ["2026-09-17T15:52", true],
    ["2026-09-17T16:21", true],
    ["2026-09-17T16:22", false],
    ["2026-09-17T23:00", false],
  ])("returns %s relevance for %s", (forecastTime, expected) => {
    expect(isCloudCoverRelevant(forecastTime, sunTimes)).toBe(expected);
  });

  it("keeps cloud cover relevant when sun times are unavailable", () => {
    expect(isCloudCoverRelevant("2026-09-18T01:00", sunTimes)).toBe(true);
  });

  it("keeps cloud cover relevant when a timestamp is invalid", () => {
    expect(
      isCloudCoverRelevant("2026-09-17Tinvalid", sunTimes),
    ).toBe(true);
  });
});