import type { MarineForecast } from "../marine-forecast.js";
import type { OpenMeteoMarineResponse } from "./open-meteo-marine-response.schema.js";

const hourlyFields = [
  "sea_surface_temperature",
  "wave_height",
  "wave_direction",
  "wave_period",
] as const;

export function mapOpenMeteoMarineResponse(
  response: OpenMeteoMarineResponse,
  generatedAt: string,
): MarineForecast {
  const pointCount = response.hourly.time.length;

  for (const field of hourlyFields) {
    if (response.hourly[field].length !== pointCount) {
      throw new Error(
        `Open-Meteo Marine returned inconsistent hourly field: ${field}`,
      );
    }
  }

  return {
    location: { latitude: response.latitude, longitude: response.longitude },
    timezone: "UTC",
    generatedAt,
    hourly: response.hourly.time.map((time, index) => ({
      time,
      seaSurfaceTemperatureCelsius:
        response.hourly.sea_surface_temperature[index]!,
      waveHeightMeters: response.hourly.wave_height[index]!,
      waveDirectionDegrees: response.hourly.wave_direction[index]!,
      wavePeriodSeconds: response.hourly.wave_period[index]!,
    })),
  };
}
