import type { BeachForecast } from "@kuda-krym/contracts";

import type {
  HourlyMarineConditions,
  MarineForecast,
} from "../marine/marine-forecast.js";
import { scoreSeaConditions } from "../scoring/sea-conditions.score.js";
import { scoreWeatherComfort } from "../scoring/weather-comfort.score.js";
import type {
  HourlyWeather,
  WeatherForecast,
} from "../weather/weather-forecast.js";

type ForecastHour = BeachForecast["hourly"][number];

export function mapForecastHours(
  weather: WeatherForecast,
  marine: MarineForecast,
): ForecastHour[] {
  const marineByTime = new Map(
    marine.hourly.map((conditions) => [conditions.time, conditions]),
  );

  return weather.hourly.map((conditions) =>
    mapForecastHour(conditions, marineByTime.get(conditions.time)),
  );
}

function mapForecastHour(
  weather: HourlyWeather,
  marine?: HourlyMarineConditions,
): ForecastHour {
  const seaSurfaceTemperatureCelsius =
    marine?.seaSurfaceTemperatureCelsius ?? null;
  const waveHeightMeters = marine?.waveHeightMeters ?? null;

  return {
    time: weather.time,
    weather: {
      temperatureCelsius: weather.temperatureCelsius,
      precipitationProbabilityPercent:
        weather.precipitationProbabilityPercent,
      precipitationMillimeters: weather.precipitationMillimeters,
      windSpeedMetersPerSecond: weather.windSpeedMetersPerSecond,
      windDirectionDegrees: weather.windDirectionDegrees,
      windGustMetersPerSecond: weather.windGustMetersPerSecond,
      cloudCoverPercent: weather.cloudCoverPercent,
    },
    marine: {
      seaSurfaceTemperatureCelsius,
      waveHeightMeters,
      waveDirectionDegrees: marine?.waveDirectionDegrees ?? null,
      wavePeriodSeconds: marine?.wavePeriodSeconds ?? null,
    },
    scores: {
      sea: scoreSeaConditions({
        waveHeightMeters,
        windSpeedMetersPerSecond: weather.windSpeedMetersPerSecond,
        waterTemperatureCelsius: seaSurfaceTemperatureCelsius,
        windGustMetersPerSecond: weather.windGustMetersPerSecond,
      }),
      weather: scoreWeatherComfort({
        airTemperatureCelsius: weather.temperatureCelsius,
        precipitationProbabilityPercent:
          weather.precipitationProbabilityPercent,
        precipitationMillimeters: weather.precipitationMillimeters,
        cloudCoverPercent: weather.cloudCoverPercent,
      }),
    },
  };
}
