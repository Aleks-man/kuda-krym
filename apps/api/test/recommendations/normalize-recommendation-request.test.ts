import { describe, expect, it } from "vitest";

import {
  UnsupportedRecommendationDateError,
  UnsupportedRecommendationOriginError,
} from "../../src/modules/recommendations/context/recommendation-context.error.js";
import { normalizeRecommendationRequest } from "../../src/modules/recommendations/context/normalize-recommendation-request.js";

const now = new Date("2026-08-20T08:00:00.000Z");

describe("normalizeRecommendationRequest", () => {
  it("normalizes today's request into a UTC calculation context", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "simferopol",
        date: "2026-08-20",
        time: "day",
        surface: "sand",
        priority: "calm_sea",
        maxTravelMinutes: 120,
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
      preferredSurface: "SAND",
      priority: "CALM_SEA",
      maxTravelMinutes: 120,
    });
  });

  it("uses two forecast days for tomorrow", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "yalta",
        date: "2026-08-21",
        time: "morning",
        surface: "any",
        priority: "comfort",
        maxTravelMinutes: 90,
      },
      now,
    );

    expect(context.forecastDays).toBe(2);
    expect(context.visitWindow).toEqual({
      startsAt: "2026-08-21T05:00:00.000Z",
      endsAt: "2026-08-21T10:00:00.000Z",
    });
    expect(context.priority).toBe("COMFORT");
  });

  it("supports a full-day visit window", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "sevastopol",
        date: "2026-08-20",
        time: "all_day",
        surface: "any",
        priority: "comfort",
        maxTravelMinutes: 60,
      },
      now,
    );

    expect(context.visitWindow).toEqual({
      startsAt: "2026-08-20T05:00:00.000Z",
      endsAt: "2026-08-20T17:00:00.000Z",
    });
  });

  it("resolves an expanded departure location", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "dzhankoy",
        date: "2026-08-20",
        time: "day",
        surface: "any",
        priority: "comfort",
        maxTravelMinutes: 180,
      },
      now,
    );

    expect(context.origin).toEqual({
      code: "dzhankoy",
      name: "Джанкой",
      latitude: 45.7131,
      longitude: 34.3927,
    });
  });

  it("normalizes a searched departure location", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: {
          id: "osm:N:100",
          name: "Николаевка",
          context: "Симферопольский район · Крым",
          latitude: 44.966,
          longitude: 33.614,
        },
        date: "2026-08-20",
        time: "day",
        surface: "any",
        priority: "comfort",
        maxTravelMinutes: 120,
      },
      now,
    );

    expect(context.origin).toEqual({
      code: "osm:N:100",
      name: "Николаевка",
      latitude: 44.966,
      longitude: 33.614,
    });
  });

  it("rejects searched coordinates outside Crimea", () => {
    expect(() =>
      normalizeRecommendationRequest(
        {
          origin: {
            id: "osm:N:outside",
            name: "Другой регион",
            context: "",
            latitude: 50,
            longitude: 40,
          },
          date: "2026-08-20",
          time: "day",
          surface: "any",
          priority: "comfort",
          maxTravelMinutes: 120,
        },
        now,
      ),
    ).toThrow(UnsupportedRecommendationOriginError);
  });

  it("uses three forecast days for the day after tomorrow", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "feodosia",
        date: "2026-08-22",
        time: "day",
        surface: "pebble",
        priority: "warm_water",
        maxTravelMinutes: 120,
      },
      now,
    );

    expect(context.forecastDays).toBe(3);
    expect(context.visitWindow).toEqual({
      startsAt: "2026-08-22T09:00:00.000Z",
      endsAt: "2026-08-22T14:00:00.000Z",
    });
  });

  it("uses the Crimea calendar date around UTC midnight", () => {
    const context = normalizeRecommendationRequest(
      {
        origin: "kerch",
        date: "2026-08-21",
        time: "evening",
        surface: "pebble",
        priority: "warm_water",
        maxTravelMinutes: 180,
      },
      new Date("2026-08-20T22:30:00.000Z"),
    );

    expect(context.forecastDays).toBe(1);
  });

  it("rejects a date outside the three-day forecast window", () => {
    expect(() =>
      normalizeRecommendationRequest(
        {
          origin: "sevastopol",
          date: "2026-08-23",
          time: "day",
          surface: "any",
          priority: "calm_sea",
          maxTravelMinutes: 60,
        },
        now,
      ),
    ).toThrow(UnsupportedRecommendationDateError);
  });
});
