import { describe, expect, it } from "vitest";

import type { ModelWeatherForecast } from "../../src/modules/weather/models/model-weather-forecast.js";
import { summarizeWeatherModelFreshness } from "../../src/modules/weather/models/comparison/weather-model-freshness.js";

const location = { latitude: 44.495, longitude: 34.166 };

function createForecast(
  model: ModelWeatherForecast["model"],
  status: "FRESH" | "STALE",
  generatedAt: string,
): ModelWeatherForecast {
  return {
    model,
    location,
    timezone: "UTC",
    generatedAt,
    freshness: { status, generatedAt },
    hourly: [],
  };
}

describe("weather model freshness", () => {
  it("uses the oldest generation time and weakest status", () => {
    const freshness = summarizeWeatherModelFreshness([
      createForecast("ECMWF_IFS", "FRESH", "2026-08-27T08:05:00.000Z"),
      createForecast("DWD_ICON", "STALE", "2026-08-27T07:55:00.000Z"),
      createForecast("NOAA_GFS", "FRESH", "2026-08-27T08:00:00.000Z"),
    ]);

    expect(freshness).toEqual({
      status: "STALE",
      generatedAt: "2026-08-27T07:55:00.000Z",
    });
  });

  it("returns null without available models", () => {
    expect(summarizeWeatherModelFreshness([])).toBeNull();
  });
});
