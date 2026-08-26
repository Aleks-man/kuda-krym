import { describe, expect, it, vi } from "vitest";

import { WeatherModelComparisonService } from "../../src/modules/weather/models/comparison/weather-model-comparison.service.js";
import type { ModelWeatherForecast } from "../../src/modules/weather/models/model-weather-forecast.js";

const location = { latitude: 44.495, longitude: 34.166 } as const;

describe("WeatherModelComparisonService", () => {
  it("composes loading, alignment and agreement", async () => {
    const load = vi.fn().mockResolvedValue({
      available: [
        createForecast("ECMWF_IFS", 24),
        createForecast("DWD_ICON", 25),
        createForecast("NOAA_GFS", 26),
      ],
      failures: [],
    });
    const service = new WeatherModelComparisonService({
      batchLoader: { load },
      now: () => new Date("2026-08-26T08:05:00.000Z"),
    });

    const result = await service.compare(location, 2);

    expect(load).toHaveBeenCalledWith(location, 2);
    expect(result).toMatchObject({
      location,
      generatedAt: "2026-08-26T08:05:00.000Z",
      models: {
        available: ["ECMWF_IFS", "DWD_ICON", "NOAA_GFS"],
        failures: [],
      },
    });
    expect(result.hourly).toHaveLength(1);
    expect(result.hourly[0]).toMatchObject({
      time: "2026-08-26T10:00",
      agreement: { modelCount: 3, score: expect.any(Number) },
    });
  });

  it("keeps partial results and failed model metadata", async () => {
    const service = new WeatherModelComparisonService({
      batchLoader: {
        load: vi.fn().mockResolvedValue({
          available: [
            createForecast("ECMWF_IFS", 24),
            createForecast("NOAA_GFS", 25),
          ],
          failures: [
            { model: "DWD_ICON", code: "MODEL_UNAVAILABLE" },
          ],
        }),
      },
    });

    const result = await service.compare(location, 1);

    expect(result.models.failures).toEqual([
      { model: "DWD_ICON", code: "MODEL_UNAVAILABLE" },
    ]);
    expect(result.hourly[0]?.agreement.modelCount).toBe(2);
    expect(result.hourly[0]?.agreement.score).not.toBeNull();
  });

  it("returns an empty comparison when every model is unavailable", async () => {
    const service = new WeatherModelComparisonService({
      batchLoader: {
        load: vi.fn().mockResolvedValue({
          available: [],
          failures: [
            { model: "ECMWF_IFS", code: "MODEL_UNAVAILABLE" },
            { model: "DWD_ICON", code: "MODEL_UNAVAILABLE" },
            { model: "NOAA_GFS", code: "MODEL_UNAVAILABLE" },
          ],
        }),
      },
    });

    const result = await service.compare(location, 1);

    expect(result.hourly).toEqual([]);
    expect(result.models.available).toEqual([]);
    expect(result.models.failures).toHaveLength(3);
  });
});

function createForecast(
  model: ModelWeatherForecast["model"],
  temperatureCelsius: number,
): ModelWeatherForecast {
  return {
    model,
    location,
    timezone: "UTC",
    generatedAt: "2026-08-26T08:00:00.000Z",
    hourly: [
      {
        time: "2026-08-26T10:00",
        temperatureCelsius,
        precipitationMillimeters: 0,
        windSpeedMetersPerSecond: 3,
        windDirectionDegrees: 240,
        windGustMetersPerSecond: 5,
        cloudCoverPercent: 20,
      },
    ],
  };
}
