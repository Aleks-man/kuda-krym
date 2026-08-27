import type { BeachForecast } from "@kuda-krym/contracts";

import type { MarineForecastProvider } from "../marine/marine-forecast.js";
import type { WeatherForecastProvider } from "../weather/weather-forecast.js";
import type { WeatherModelComparisonService } from "../weather/models/comparison/weather-model-comparison.service.js";
import { mapForecastHours } from "./forecast-hour.mapper.js";
import type { ForecastBeachRepository } from "./forecast-beach.repository.js";
import { loadWeatherModelAgreements } from "./load-weather-model-agreements.js";
import { mapForecastFreshness } from "./freshness/forecast-freshness.mapper.js";

type BeachForecastServiceDependencies = Readonly<{
  beachRepository: ForecastBeachRepository;
  weatherProvider: WeatherForecastProvider;
  marineProvider: MarineForecastProvider;
  modelComparisonService: Pick<WeatherModelComparisonService, "compare">;
  now?: () => Date;
}>;

export class BeachForecastService {
  private readonly now: () => Date;

  public constructor(
    private readonly dependencies: BeachForecastServiceDependencies,
  ) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async getForecast(
    beachId: string,
    days: 1 | 2,
  ): Promise<BeachForecast | null> {
    const beach = await this.dependencies.beachRepository.findPublishedById(
      beachId,
    );
    if (!beach) return null;

    const request = {
      location: { latitude: beach.latitude, longitude: beach.longitude },
      days,
    } as const;
    const [weather, marine, modelAgreementLoad] = await Promise.all([
      this.dependencies.weatherProvider.getForecast(request),
      this.dependencies.marineProvider.getForecast(request),
      loadWeatherModelAgreements(
        this.dependencies.modelComparisonService,
        request.location,
        days,
      ),
    ]);

    const generatedAt = this.now();

    return {
      beach: {
        id: beach.id,
        slug: beach.slug,
        name: beach.name,
        coordinates: request.location,
      },
      timezone: "UTC",
      generatedAt: generatedAt.toISOString(),
      freshness: mapForecastFreshness(
        weather,
        marine,
        modelAgreementLoad.freshness,
      ),
      hourly: mapForecastHours(weather, marine, {
        evaluatedAt: generatedAt,
        modelAgreements: modelAgreementLoad.hours,
      }),
    };
  }
}
