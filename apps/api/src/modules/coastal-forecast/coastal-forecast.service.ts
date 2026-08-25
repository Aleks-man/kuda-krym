import type { CoastalForecast } from "@kuda-krym/contracts";

import type { CoastalLocationRepository } from "../coastal-locations/coastal-location.repository.js";
import { mapForecastHours } from "../forecast/forecast-hour.mapper.js";
import type { MarineForecastProvider } from "../marine/marine-forecast.js";
import type { WeatherForecastProvider } from "../weather/weather-forecast.js";

type CoastalForecastServiceDependencies = Readonly<{
  locationRepository: CoastalLocationRepository;
  weatherProvider: WeatherForecastProvider;
  marineProvider: MarineForecastProvider;
  now?: () => Date;
}>;

export class CoastalForecastService {
  private readonly now: () => Date;

  public constructor(
    private readonly dependencies: CoastalForecastServiceDependencies,
  ) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async getForecast(
    slug: string,
    days: 1 | 2,
  ): Promise<CoastalForecast | null> {
    const location =
      await this.dependencies.locationRepository.findPublishedBySlug(slug);
    if (!location) return null;

    const [weather, marine] = await Promise.all([
      this.dependencies.weatherProvider.getForecast({
        location: location.weatherCoordinates,
        days,
      }),
      this.dependencies.marineProvider.getForecast({
        location: location.marineCoordinates,
        days,
      }),
    ]);

    return {
      location,
      timezone: "UTC",
      generatedAt: this.now().toISOString(),
      hourly: mapForecastHours(weather, marine),
    };
  }
}
