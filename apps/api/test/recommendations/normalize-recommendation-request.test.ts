import { describe, expect, it } from "vitest";

import { UnsupportedRecommendationDateError } from "../../src/modules/recommendations/context/recommendation-context.error.js";
import { normalizeRecommendationRequest } from "../../src/modules/recommendations/context/normalize-recommendation-request.js";

const now = new Date("2026-08-20T08:00:00.000Z");

describe("normalizeRecommendationRequest", () => {
  it("normalizes today's request into a UTC calculation context", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "simferopol",
        date: "2026-08-20",
        time: "day",
        company: "children",
        surface: "sand",
        priority: "calm_sea",
      },
      now,
    );

    expect(context).toEqual({
      origin: {
        code: "simferopol",
        name: "Симферополь",
        latitude: 44.952117,
        longitude: 34.102417,
      },
      date: "2026-08-20",
      forecastDays: 1,
      visitWindow: {
        startsAt: "2026-08-20T09:00:00.000Z",
        endsAt: "2026-08-20T14:00:00.000Z",
      },
      company: "WITH_CHILDREN",
      preferredSurface: "SAND",
      priority: "CALM_SEA",
    });
  });

  it("uses two forecast days for tomorrow", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "yalta",
        date: "2026-08-21",
        time: "morning",
        company: "alone",
        surface: "any",
        priority: "comfort",
      },
      now,
    );

    expect(context.forecastDays).toBe(2);
    expect(context.visitWindow).toEqual({
      startsAt: "2026-08-21T06:00:00.000Z",
      endsAt: "2026-08-21T10:00:00.000Z",
    });
    expect(context.priority).toBe("COMFORT");
  });

  it("uses the Crimea calendar date around UTC midnight", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "kerch",
        date: "2026-08-21",
        time: "evening",
        company: "friends",
        surface: "pebble",
        priority: "warm_water",
      },
      new Date("2026-08-20T22:30:00.000Z"),
    );

    expect(context.forecastDays).toBe(1);
    expect(context.company).toBe("FRIENDS");
  });

  it("rejects a date outside today and tomorrow", () => {
    expect(() =>
      normalizeRecommendationRequest(
        {
          origin: "sevastopol",
          date: "2026-08-22",
          time: "day",
          company: "alone",
          surface: "any",
          priority: "calm_sea",
        },
        now,
      ),
    ).toThrow(UnsupportedRecommendationDateError);
  });
});
