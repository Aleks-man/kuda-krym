import type { ForecastLocation } from "../../weather-forecast.js";
import { calculateWeatherModelAgreement } from "../agreement/calculate-weather-model-agreement.js";
import { alignWeatherModelForecasts } from "./align-weather-model-forecasts.js";
import { summarizeWeatherModelFreshness } from "./weather-model-freshness.js";
import type { WeatherModelBatchLoader } from "./weather-model-batch.loader.js";
import type {
  WeatherModelComparison,
  WeatherModelComparisonHour,
} from "./weather-model-comparison.js";

type WeatherModelComparisonServiceDependencies = Readonly<{
  batchLoader: Pick<WeatherModelBatchLoader, "load">;
  now?: () => Date;
}>;

export class WeatherModelComparisonService {
  private readonly now: () => Date;

  public constructor(
    private readonly dependencies: WeatherModelComparisonServiceDependencies,
  ) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async compare(
    location: ForecastLocation,
    days: 1 | 2,
  ): Promise<WeatherModelComparison> {
    const batch = await this.dependencies.batchLoader.load(location, days);
    const aligned = alignWeatherModelForecasts(batch.available);

    return {
      location,
      generatedAt: this.now().toISOString(),
      freshness: summarizeWeatherModelFreshness(batch.available),
      models: {
        available: batch.available.map((forecast) => forecast.model),
        failures: batch.failures,
      },
      hourly: aligned.map(createComparisonHour),
    };
  }
}

function createComparisonHour(
  aligned: Parameters<typeof calculateWeatherModelAgreement>[0],
): WeatherModelComparisonHour {
  const { time: _time, ...agreement } =
    calculateWeatherModelAgreement(aligned);

  return {
    time: aligned.time,
    samples: aligned.samples,
    agreement,
  };
}
