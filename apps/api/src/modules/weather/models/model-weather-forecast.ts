import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import type { ForecastDays } from "../../../shared/forecast/forecast-days.js";
import type { ForecastLocation } from "../weather-forecast.js";

export type WeatherModel = "ECMWF_IFS" | "DWD_ICON" | "NOAA_GFS";

export type ModelWeatherForecastRequest = Readonly<{
  model: WeatherModel;
  location: ForecastLocation;
  days: ForecastDays;
}>;

export type HourlyModelWeather = Readonly<{
  time: string;
  temperatureCelsius: number;
  precipitationMillimeters: number;
  windSpeedMetersPerSecond: number;
  windDirectionDegrees: number;
  windGustMetersPerSecond: number;
  cloudCoverPercent: number;
}>;

export type ModelWeatherForecast = Readonly<{
  model: WeatherModel;
  location: ForecastLocation;
  timezone: "UTC";
  generatedAt: string;
  hourly: HourlyModelWeather[];
  freshness?: ForecastSourceFreshness;
}>;

export interface ModelWeatherForecastProvider {
  getForecast(
    request: ModelWeatherForecastRequest,
  ): Promise<ModelWeatherForecast>;
}
