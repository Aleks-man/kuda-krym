import { getInlandForecastLocation, type CityForecast } from "@kuda-krym/contracts";

import type { ForecastDays } from "../../shared/forecast/forecast-days.js";
import { mapWeatherForecastFreshness } from "../forecast/freshness/forecast-freshness.mapper.js";
import { mapWeatherForecastHours } from "../forecast/forecast-hour.mapper.js";
import { loadWeatherModelAgreements } from "../forecast/load-weather-model-agreements.js";
import type { WeatherForecastProvider } from "../weather/weather-forecast.js";
import type { WeatherModelComparisonService } from "../weather/models/comparison/weather-model-comparison.service.js";

type Dependencies = Readonly<{
  weatherProvider: WeatherForecastProvider;
  modelComparisonService: Pick<WeatherModelComparisonService, "compare">;
  now?: () => Date;
}>;

export class CityForecastService {
  private readonly now: () => Date;

  public constructor(private readonly dependencies: Dependencies) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async getForecast(slug: string, days: ForecastDays): Promise<CityForecast | null> {
    const city = getInlandForecastLocation(slug);
    if (!city) return null;

    const [weather, modelAgreementLoad] = await Promise.all([
      this.dependencies.weatherProvider.getForecast({ location: city.coordinates, days }),
      loadWeatherModelAgreements(this.dependencies.modelComparisonService, city.coordinates, days),
    ]);
    const generatedAt = this.now();

    return {
      city,
      timezone: "UTC",
      generatedAt: generatedAt.toISOString(),
      freshness: mapWeatherForecastFreshness(weather, modelAgreementLoad.freshness),
      currentWeather: weather.current ?? null,
      sunTimes: weather.sunTimes ?? [],
      hourly: mapWeatherForecastHours(weather, {
        evaluatedAt: generatedAt,
        modelAgreements: modelAgreementLoad.hours,
      }),
    };
  }
}
