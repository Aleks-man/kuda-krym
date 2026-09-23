import { describe, expect, it } from "vitest";

import {
  formatRecommendationDate,
  getRecommendationDateOptions,
  parseRelativeRecommendationDate,
  resolveRecommendationDate,
} from "./crimea-date";

const now = new Date("2026-09-07T08:00:00.000Z");

describe("recommendation dates", () => {
  it.each([
    ["today", "2026-09-07"],
    ["tomorrow", "2026-09-08"],
    ["dayAfterTomorrow", "2026-09-09"],
    ["day3", "2026-09-10"],
    ["day6", "2026-09-13"],
  ] as const)("resolves %s in the Crimea calendar", (relativeDate, expected) => {
    expect(resolveRecommendationDate(relativeDate, now)).toBe(expected);
  });

  it("formats a compact date for a choice card", () => {
    expect(formatRecommendationDate("dayAfterTomorrow", now)).toBe(
      "9 сентября (среда)",
    );
  });

  it("rejects an unknown relative date", () => {
    expect(() => parseRelativeRecommendationDate("nextWeek")).toThrow(
      "Выберите день поездки",
    );
  });
});

it("offers seven calendar dates across the month boundary in Crimea", () => {
  const now = new Date("2026-09-29T22:30:00Z");
  const options = getRecommendationDateOptions(now);
  expect(options).toHaveLength(7);
  expect(options[0]!.label).toBe("Сегодня, 30 сентября (среда)");
  expect(options[1]!.label).toBe("Завтра, 1 октября (четверг)");
  expect(options[6]!.label).toBe("6 октября (вторник)");
  expect(resolveRecommendationDate(options[0]!.value, now)).toBe("2026-09-30");
  expect(resolveRecommendationDate(options[6]!.value, now)).toBe("2026-10-06");
  expect(parseRelativeRecommendationDate(options[6]!.value)).toBe("day6");
});
