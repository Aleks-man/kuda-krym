import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import type { ForecastDays } from "../../shared/forecast/forecast-days.js";

export type ForecastLocation = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type WeatherForecastRequest = Readonly<{
  location: ForecastLocation;
  days: ForecastDays;
}>;

export type HourlyWeather = Readonly<{
  time: string;
  temperatureCelsius: number;
  /** Optional for forecasts cached before apparent temperature was requested. */
  apparentTemperatureCelsius?: number | null;
  relativeHumidityPercent?: number | null;
  precipitationProbabilityPercent: number;
  precipitationMillimeters: number;
  windSpeedMetersPerSecond: number;
  windDirectionDegrees: number;
  windGustMetersPerSecond: number;
  cloudCoverPercent: number;
}>;

export type DailySunTimes = Readonly<{
  date: string;
  sunrise: string;
  sunset: string;
}>;

export type WeatherForecast = Readonly<{
  location: ForecastLocation;
  timezone: "UTC";
  generatedAt: string;
  sunTimes?: DailySunTimes[];
  hourly: HourlyWeather[];
  freshness?: ForecastSourceFreshness;
}>;

export interface WeatherForecastProvider {
  getForecast(request: WeatherForecastRequest): Promise<WeatherForecast>;
}
