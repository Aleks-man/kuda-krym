import type { BeachForecast } from "@kuda-krym/contracts";

import type { MarineForecastProvider } from "../marine/marine-forecast.js";
import type { WeatherForecastProvider } from "../weather/weather-forecast.js";
import type { ForecastBeachRepository } from "./forecast-beach.repository.js";

type BeachForecastServiceDependencies = Readonly<{
  beachRepository: ForecastBeachRepository;
  weatherProvider: WeatherForecastProvider;
  marineProvider: MarineForecastProvider;
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
    const [weather, marine] = await Promise.all([
      this.dependencies.weatherProvider.getForecast(request),
      this.dependencies.marineProvider.getForecast(request),
    ]);
    const marineByTime = new Map(
      marine.hourly.map((conditions) => [conditions.time, conditions]),
    );

    return {
      beach: {
        id: beach.id,
        slug: beach.slug,
        name: beach.name,
        coordinates: request.location,
      },
      timezone: "UTC",
      generatedAt: this.now().toISOString(),
      hourly: weather.hourly.map((conditions) => {
        const marineConditions = marineByTime.get(conditions.time);
        return {
          time: conditions.time,
          weather: {
            temperatureCelsius: conditions.temperatureCelsius,
            precipitationProbabilityPercent:
              conditions.precipitationProbabilityPercent,
            precipitationMillimeters: conditions.precipitationMillimeters,
            windSpeedMetersPerSecond: conditions.windSpeedMetersPerSecond,
            windDirectionDegrees: conditions.windDirectionDegrees,
            windGustMetersPerSecond: conditions.windGustMetersPerSecond,
            cloudCoverPercent: conditions.cloudCoverPercent,
          },
          marine: {
            seaSurfaceTemperatureCelsius:
              marineConditions?.seaSurfaceTemperatureCelsius ?? null,
            waveHeightMeters: marineConditions?.waveHeightMeters ?? null,
            waveDirectionDegrees:
              marineConditions?.waveDirectionDegrees ?? null,
            wavePeriodSeconds: marineConditions?.wavePeriodSeconds ?? null,
          },
        };
      }),
    };
  }
}
