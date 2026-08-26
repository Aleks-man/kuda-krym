import { describe, expect, it, vi } from "vitest";

import { WeatherModelBatchLoader } from "../../src/modules/weather/models/comparison/weather-model-batch.loader.js";
import type {
  ModelWeatherForecast,
  WeatherModel,
} from "../../src/modules/weather/models/model-weather-forecast.js";

const location = { latitude: 44.495, longitude: 34.166 } as const;

describe("WeatherModelBatchLoader", () => {
  it("loads all weather models in parallel", async () => {
    let activeRequests = 0;
    let maximumActiveRequests = 0;
    const getForecast = vi.fn(async ({ model }: { model: WeatherModel }) => {
      activeRequests += 1;
      maximumActiveRequests = Math.max(maximumActiveRequests, activeRequests);
      await new Promise((resolve) => setTimeout(resolve, 2));
      activeRequests -= 1;
      return createForecast(model);
    });
    const loader = new WeatherModelBatchLoader({ getForecast });

    const result = await loader.load(location, 2);

    expect(maximumActiveRequests).toBe(3);
    expect(result.available.map(({ model }) => model)).toEqual([
      "ECMWF_IFS",
      "DWD_ICON",
      "NOAA_GFS",
    ]);
    expect(result.failures).toEqual([]);
    expect(getForecast).toHaveBeenCalledTimes(3);
    expect(getForecast).toHaveBeenCalledWith({
      model: "ECMWF_IFS",
      location,
      days: 2,
    });
  });

  it("keeps available forecasts when one model fails", async () => {
    const loader = new WeatherModelBatchLoader({
      getForecast: vi.fn(async ({ model }) => {
        if (model === "DWD_ICON") throw new Error("upstream failed");
        return createForecast(model);
      }),
    });

    const result = await loader.load(location, 1);

    expect(result.available.map(({ model }) => model)).toEqual([
      "ECMWF_IFS",
      "NOAA_GFS",
    ]);
    expect(result.failures).toEqual([
      { model: "DWD_ICON", code: "MODEL_UNAVAILABLE" },
    ]);
  });

  it("reports every unavailable model without rejecting the batch", async () => {
    const loader = new WeatherModelBatchLoader({
      getForecast: vi.fn().mockRejectedValue(new Error("upstream failed")),
    });

    const result = await loader.load(location, 1);

    expect(result.available).toEqual([]);
    expect(result.failures).toHaveLength(3);
    expect(result.failures.map(({ model }) => model)).toEqual([
      "ECMWF_IFS",
      "DWD_ICON",
      "NOAA_GFS",
    ]);
  });
});

function createForecast(model: WeatherModel): ModelWeatherForecast {
  return {
    model,
    location,
    timezone: "UTC",
    generatedAt: "2026-08-26T08:00:00.000Z",
    hourly: [],
  };
}
