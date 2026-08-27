import { describe, expect, it } from "vitest";

import { mapForecastFreshness } from "../../src/modules/forecast/freshness/forecast-freshness.mapper.js";

const baseForecast = {
  location: { latitude: 44.495, longitude: 34.166 },
  timezone: "UTC" as const,
  hourly: [],
};

describe("forecast freshness mapper", () => {
  it("marks the combined forecast stale when one source is stale", () => {
    const freshness = mapForecastFreshness(
      {
        ...baseForecast,
        generatedAt: "2026-08-27T08:00:00.000Z",
        freshness: {
          status: "STALE",
          generatedAt: "2026-08-27T08:00:00.000Z",
        },
      },
      {
        ...baseForecast,
        generatedAt: "2026-08-27T08:10:00.000Z",
      },
      {
        status: "FRESH",
        generatedAt: "2026-08-27T08:05:00.000Z",
      },
    );

    expect(freshness.status).toBe("STALE");
    expect(freshness.sources.weather.status).toBe("STALE");
    expect(freshness.sources.marine.status).toBe("FRESH");
  });

  it("allows unavailable model freshness without making data stale", () => {
    const freshness = mapForecastFreshness(
      { ...baseForecast, generatedAt: "2026-08-27T08:00:00.000Z" },
      { ...baseForecast, generatedAt: "2026-08-27T08:00:00.000Z" },
      null,
    );

    expect(freshness.status).toBe("FRESH");
    expect(freshness.sources.weatherModels).toBeNull();
  });
});
