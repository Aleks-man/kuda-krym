import type {
  HourlyModelWeather,
  ModelWeatherForecast,
  WeatherModel,
} from "../model-weather-forecast.js";
import type {
  AlignedWeatherModelHour,
  WeatherModelSample,
} from "./weather-model-alignment.js";
import { comparisonWeatherModels } from "./weather-model-batch.js";

export function alignWeatherModelForecasts(
  forecasts: readonly ModelWeatherForecast[],
): AlignedWeatherModelHour[] {
  const forecastsByModel = indexForecastsByModel(forecasts);
  const allTimes = new Set<string>();

  for (const forecast of forecasts) {
    for (const hour of forecast.hourly) allTimes.add(hour.time);
  }

  return [...allTimes].sort().map((time) => ({
    time,
    samples: comparisonWeatherModels.flatMap((model) => {
      const forecast = forecastsByModel.get(model);
      if (!forecast) return [];
      const conditions = findUniqueHour(forecast.hourly, time, model);
      return conditions ? [createSample(forecast, conditions)] : [];
    }),
  }));
}

function indexForecastsByModel(
  forecasts: readonly ModelWeatherForecast[],
): Map<WeatherModel, ModelWeatherForecast> {
  const indexed = new Map<WeatherModel, ModelWeatherForecast>();

  for (const forecast of forecasts) {
    if (indexed.has(forecast.model)) {
      throw new Error(`Duplicate weather model forecast: ${forecast.model}`);
    }
    indexed.set(forecast.model, forecast);
  }

  return indexed;
}

function findUniqueHour(
  hourly: readonly HourlyModelWeather[],
  time: string,
  model: WeatherModel,
): HourlyModelWeather | undefined {
  const matches = hourly.filter((hour) => hour.time === time);
  if (matches.length > 1) {
    throw new Error(`Duplicate ${model} forecast hour: ${time}`);
  }
  return matches[0];
}

function createSample(
  forecast: ModelWeatherForecast,
  { time: _time, ...conditions }: HourlyModelWeather,
): WeatherModelSample {
  return {
    model: forecast.model,
    generatedAt: forecast.generatedAt,
    conditions,
  };
}
