import type { ForecastLocation } from "../weather-forecast.js";

export type WeatherModel = "ECMWF_IFS" | "DWD_ICON" | "NOAA_GFS";

export type ModelWeatherForecastRequest = Readonly<{
  model: WeatherModel;
  location: ForecastLocation;
  days: 1 | 2;
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
}>;

export interface ModelWeatherForecastProvider {
  getForecast(
    request: ModelWeatherForecastRequest,
  ): Promise<ModelWeatherForecast>;
}
