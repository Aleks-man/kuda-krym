import type { WeatherForecast } from "../weather-forecast.js";
import type { OpenMeteoResponse } from "./open-meteo-response.schema.js";

const hourlyFields = [
  "temperature_2m",
  "precipitation_probability",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "cloud_cover",
] as const;

export function mapOpenMeteoResponse(
  response: OpenMeteoResponse,
  generatedAt: string,
): WeatherForecast {
  const pointCount = response.hourly.time.length;

  for (const field of hourlyFields) {
    if (response.hourly[field].length !== pointCount) {
      throw new Error(`Open-Meteo returned inconsistent hourly field: ${field}`);
    }
  }

  if (response.hourly.apparent_temperature && response.hourly.apparent_temperature.length !== pointCount) {
    throw new Error("Open-Meteo returned inconsistent hourly field: apparent_temperature");
  }

  if (response.hourly.relative_humidity_2m && response.hourly.relative_humidity_2m.length !== pointCount) {
    throw new Error("Open-Meteo returned inconsistent hourly field: relative_humidity_2m");
  }

  if (response.hourly.uv_index && response.hourly.uv_index.length !== pointCount) {
    throw new Error("Open-Meteo returned inconsistent hourly field: uv_index");
  }

  for (const field of ["surface_pressure", "visibility"] as const) {
    if (response.hourly[field] && response.hourly[field].length !== pointCount) {
      throw new Error(`Open-Meteo returned inconsistent hourly field: ${field}`);
    }
  }

  const dayCount = response.daily.time.length;
  if (
    response.daily.sunrise.length !== dayCount ||
    response.daily.sunset.length !== dayCount
  ) {
    throw new Error("Open-Meteo returned inconsistent daily sun times");
  }

  return {
    location: { latitude: response.latitude, longitude: response.longitude },
    timezone: "UTC",
    generatedAt,
    current: response.current ? {
      time: response.current.time,
      intervalSeconds: response.current.interval,
      temperatureCelsius: response.current.temperature_2m,
      apparentTemperatureCelsius: response.current.apparent_temperature ?? null,
      relativeHumidityPercent: response.current.relative_humidity_2m ?? null,
      surfacePressureHpa: response.current.surface_pressure ?? null,
      visibilityMeters: response.current.visibility ?? null,
      uvIndex: response.current.uv_index ?? null,
      precipitationMillimeters: response.current.precipitation,
      windSpeedMetersPerSecond: response.current.wind_speed_10m,
      windDirectionDegrees: response.current.wind_direction_10m,
      windGustMetersPerSecond: response.current.wind_gusts_10m,
      cloudCoverPercent: response.current.cloud_cover,
      weatherCode: response.current.weather_code ?? null,
      isDay: response.current.is_day == null ? null : response.current.is_day === 1,
    } : null,
    sunTimes: response.daily.time.map((date, index) => ({
      date,
      sunrise: response.daily.sunrise[index]!,
      sunset: response.daily.sunset[index]!,
    })),
    hourly: response.hourly.time.map((time, index) => ({
      time,
      temperatureCelsius: response.hourly.temperature_2m[index]!,
      surfacePressureHpa: response.hourly.surface_pressure?.[index] ?? null,
      visibilityMeters: response.hourly.visibility?.[index] ?? null,
      uvIndex: response.hourly.uv_index?.[index] ?? null,
      relativeHumidityPercent: response.hourly.relative_humidity_2m?.[index] ?? null,
      apparentTemperatureCelsius: response.hourly.apparent_temperature?.[index] ?? null,
      precipitationProbabilityPercent:
        response.hourly.precipitation_probability[index]!,
      precipitationMillimeters: response.hourly.precipitation[index]!,
      windSpeedMetersPerSecond: response.hourly.wind_speed_10m[index]!,
      windDirectionDegrees: response.hourly.wind_direction_10m[index]!,
      windGustMetersPerSecond: response.hourly.wind_gusts_10m[index]!,
      cloudCoverPercent: response.hourly.cloud_cover[index]!,
    })),
  };
}
