import type { BeachForecast } from "@kuda-krym/contracts";

import { calculateForecastConfidence } from "../confidence/calculate-forecast-confidence.js";
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
import type { ModelAgreementHour } from "./load-weather-model-agreements.js";

type ForecastHour = BeachForecast["hourly"][number];

type ForecastHourMappingOptions = Readonly<{
  evaluatedAt?: Date;
  modelAgreements?: readonly ModelAgreementHour[];
}>;

export function mapForecastHours(
  weather: WeatherForecast,
  marine: MarineForecast,
  options: ForecastHourMappingOptions = {},
): ForecastHour[] {
  const marineByTime = new Map(
    marine.hourly.map((conditions) => [conditions.time, conditions]),
  );
  const agreementByTime = new Map(
    options.modelAgreements?.map((agreement) => [agreement.time, agreement.score]),
  );
  const evaluatedAt = options.evaluatedAt ?? new Date();

  return weather.hourly.map((conditions) =>
    mapForecastHour(
      conditions,
      marineByTime.get(conditions.time),
      oldestGeneratedAt(weather.generatedAt, marine.generatedAt),
      evaluatedAt,
      agreementByTime.get(conditions.time),
    ),
  );
}

function mapForecastHour(
  weather: HourlyWeather,
  marine: HourlyMarineConditions | undefined,
  generatedAt: string,
  evaluatedAt: Date,
  modelAgreementPercent: number | null | undefined,
): ForecastHour {
  const seaSurfaceTemperatureCelsius =
    marine?.seaSurfaceTemperatureCelsius ?? null;
  const waveHeightMeters = marine?.waveHeightMeters ?? null;

  const scores = {
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
  };

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
    scores,
    confidence: calculateForecastConfidence({
      generatedAt,
      forecastTime: `${weather.time}Z`,
      completenessPercent: Math.round(
        (scores.sea.coveragePercent + scores.weather.coveragePercent) / 2,
      ),
      ...(modelAgreementPercent === undefined
        ? {}
        : { modelAgreementPercent }),
      evaluatedAt,
    }),
  };
}

function oldestGeneratedAt(left: string, right: string): string {
  return new Date(
    Math.min(new Date(left).getTime(), new Date(right).getTime()),
  ).toISOString();
}
