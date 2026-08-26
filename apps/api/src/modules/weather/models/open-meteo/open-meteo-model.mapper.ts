import type {
  ModelWeatherForecast,
  WeatherModel,
} from "../model-weather-forecast.js";
import type { OpenMeteoModelResponse } from "./open-meteo-model-response.schema.js";

const hourlyFields = [
  "temperature_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "cloud_cover",
] as const;

export function mapOpenMeteoModelResponse(
  model: WeatherModel,
  response: OpenMeteoModelResponse,
  generatedAt: string,
): ModelWeatherForecast {
  const pointCount = response.hourly.time.length;

  for (const field of hourlyFields) {
    if (response.hourly[field].length !== pointCount) {
      throw new Error(
        `Open-Meteo ${model} returned inconsistent hourly field: ${field}`,
      );
    }
  }

  return {
    model,
    location: { latitude: response.latitude, longitude: response.longitude },
    timezone: "UTC",
    generatedAt,
    hourly: response.hourly.time.map((time, index) => ({
      time,
      temperatureCelsius: response.hourly.temperature_2m[index]!,
      precipitationMillimeters: response.hourly.precipitation[index]!,
      windSpeedMetersPerSecond: response.hourly.wind_speed_10m[index]!,
      windDirectionDegrees: response.hourly.wind_direction_10m[index]!,
      windGustMetersPerSecond: response.hourly.wind_gusts_10m[index]!,
      cloudCoverPercent: response.hourly.cloud_cover[index]!,
    })),
  };
}
