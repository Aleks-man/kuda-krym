import type { ForecastLocation } from "../../weather-forecast.js";
import type {
  ModelWeatherForecast,
  ModelWeatherForecastProvider,
  WeatherModel,
} from "../model-weather-forecast.js";
import {
  comparisonWeatherModels,
  type WeatherModelBatch,
  type WeatherModelFailure,
} from "./weather-model-batch.js";

type ModelLoadResult =
  | Readonly<{ status: "available"; forecast: ModelWeatherForecast }>
  | Readonly<{ status: "failed"; failure: WeatherModelFailure }>;

export class WeatherModelBatchLoader {
  public constructor(
    private readonly provider: ModelWeatherForecastProvider,
  ) {}

  public async load(
    location: ForecastLocation,
    days: 1 | 2,
  ): Promise<WeatherModelBatch> {
    const results = await Promise.all(
      comparisonWeatherModels.map((model) =>
        this.loadModel(model, location, days),
      ),
    );

    return results.reduce<WeatherModelBatch>(
      (batch, result) => {
        if (result.status === "available") {
          batch.available.push(result.forecast);
        } else {
          batch.failures.push(result.failure);
        }
        return batch;
      },
      { available: [], failures: [] },
    );
  }

  private async loadModel(
    model: WeatherModel,
    location: ForecastLocation,
    days: 1 | 2,
  ): Promise<ModelLoadResult> {
    try {
      const forecast = await this.provider.getForecast({
        model,
        location,
        days,
      });
      return { status: "available", forecast };
    } catch {
      return {
        status: "failed",
        failure: { model, code: "MODEL_UNAVAILABLE" },
      };
    }
  }
}
