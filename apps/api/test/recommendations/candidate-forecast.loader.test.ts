import { describe, expect, it, vi } from "vitest";

import type { MarineForecast } from "../../src/modules/marine/marine-forecast.js";
import type { RecommendationCandidate } from "../../src/modules/recommendations/candidates/recommendation-candidate.js";
import { CandidateForecastLoader } from "../../src/modules/recommendations/forecasts/candidate-forecast.loader.js";
import type { WeatherForecast } from "../../src/modules/weather/weather-forecast.js";

const candidates: RecommendationCandidate[] = [
  createCandidate("1", "first", 44.1),
  createCandidate("2", "broken", 44.2),
  createCandidate("3", "third", 44.3),
  createCandidate("4", "fourth", 44.4),
];

describe("CandidateForecastLoader", () => {
  it("limits candidate concurrency and keeps processing after a failure", async () => {
    let activeWeatherRequests = 0;
    let maximumWeatherRequests = 0;
    const weatherProvider = {
      getForecast: vi.fn(async ({ location, days }) => {
        activeWeatherRequests += 1;
        maximumWeatherRequests = Math.max(
          maximumWeatherRequests,
          activeWeatherRequests,
        );
        await new Promise((resolve) => setTimeout(resolve, 2));
        activeWeatherRequests -= 1;
        if (location.latitude === 44.2) throw new Error("upstream failed");
        return createWeatherForecast(location, days);
      }),
    };
    const marineProvider = {
      getForecast: vi.fn(async ({ location }) => createMarineForecast(location)),
    };
    const loader = new CandidateForecastLoader({
      weatherProvider,
      marineProvider,
      concurrency: 2,
    });

    const result = await loader.load(candidates, 2);

    expect(maximumWeatherRequests).toBe(2);
    expect(result.available.map(({ candidate }) => candidate.slug)).toEqual([
      "first",
      "third",
      "fourth",
    ]);
    expect(result.failures).toEqual([
      {
        candidateId: "2",
        slug: "broken",
        code: "FORECAST_UNAVAILABLE",
      },
    ]);
    expect(weatherProvider.getForecast).toHaveBeenCalledTimes(4);
    expect(marineProvider.getForecast).toHaveBeenCalledTimes(4);
    expect(weatherProvider.getForecast).toHaveBeenCalledWith({
      location: { latitude: 44.1, longitude: 34 },
      days: 2,
    });
  });

  it("returns an empty batch for an empty candidate list", async () => {
    const loader = new CandidateForecastLoader({
      weatherProvider: { getForecast: vi.fn() },
      marineProvider: { getForecast: vi.fn() },
    });

    await expect(loader.load([], 1)).resolves.toEqual({
      available: [],
      failures: [],
    });
  });
});

function createCandidate(
  id: string,
  slug: string,
  latitude: number,
): RecommendationCandidate {
  return {
    id,
    slug,
    name: slug,
    latitude,
    longitude: 34,
    surface: "SAND",
    childSuitability: "SUITABLE",
  };
}

function createWeatherForecast(
  location: Readonly<{ latitude: number; longitude: number }>,
  _days: 1 | 2,
): WeatherForecast {
  return {
    location,
    timezone: "UTC",
    generatedAt: "2026-08-24T08:00:00.000Z",
    hourly: [],
  };
}

function createMarineForecast(
  location: Readonly<{ latitude: number; longitude: number }>,
): MarineForecast {
  return {
    location,
    timezone: "UTC",
    generatedAt: "2026-08-24T08:00:00.000Z",
    hourly: [],
  };
}
