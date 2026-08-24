import type { MarineForecastProvider } from "../../marine/marine-forecast.js";
import type { WeatherForecastProvider } from "../../weather/weather-forecast.js";
import { mapWithConcurrency } from "../../../shared/async/map-with-concurrency.js";
import type { RecommendationCandidate } from "../candidates/recommendation-candidate.js";
import type {
  CandidateForecast,
  CandidateForecastBatch,
  CandidateForecastFailure,
} from "./candidate-forecast.js";

type CandidateForecastLoaderDependencies = Readonly<{
  weatherProvider: WeatherForecastProvider;
  marineProvider: MarineForecastProvider;
  concurrency?: number;
}>;

type CandidateForecastResult =
  | Readonly<{ status: "available"; forecast: CandidateForecast }>
  | Readonly<{ status: "failed"; failure: CandidateForecastFailure }>;

export class CandidateForecastLoader {
  private readonly concurrency: number;

  public constructor(
    private readonly dependencies: CandidateForecastLoaderDependencies,
  ) {
    this.concurrency = dependencies.concurrency ?? 3;
  }

  public async load(
    candidates: readonly RecommendationCandidate[],
    forecastDays: 1 | 2,
  ): Promise<CandidateForecastBatch> {
    const results = await mapWithConcurrency(
      candidates,
      this.concurrency,
      (candidate) => this.loadCandidate(candidate, forecastDays),
    );

    return results.reduce<CandidateForecastBatch>(
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

  private async loadCandidate(
    candidate: RecommendationCandidate,
    forecastDays: 1 | 2,
  ): Promise<CandidateForecastResult> {
    const request = {
      location: {
        latitude: candidate.latitude,
        longitude: candidate.longitude,
      },
      days: forecastDays,
    } as const;

    const [weather, marine] = await Promise.allSettled([
      this.dependencies.weatherProvider.getForecast(request),
      this.dependencies.marineProvider.getForecast(request),
    ]);

    if (weather.status === "rejected" || marine.status === "rejected") {
      return {
        status: "failed",
        failure: {
          candidateId: candidate.id,
          slug: candidate.slug,
          code: "FORECAST_UNAVAILABLE",
        },
      };
    }

    return {
      status: "available",
      forecast: {
        candidate,
        weather: weather.value,
        marine: marine.value,
      },
    };
  }
}
