import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

import type { ForecastDays } from "../../shared/forecast/forecast-days.js";

export type MarineForecastRequest = Readonly<{
  location: Readonly<{ latitude: number; longitude: number }>;
  days: ForecastDays;
}>;

export type HourlyMarineConditions = Readonly<{
  time: string;
  seaSurfaceTemperatureCelsius: number | null;
  waveHeightMeters: number | null;
  waveDirectionDegrees: number | null;
  wavePeriodSeconds: number | null;
}>;

export type MarineForecast = Readonly<{
  location: Readonly<{ latitude: number; longitude: number }>;
  timezone: "UTC";
  generatedAt: string;
  hourly: HourlyMarineConditions[];
  freshness?: ForecastSourceFreshness;
}>;

export interface MarineForecastProvider {
  getForecast(request: MarineForecastRequest): Promise<MarineForecast>;
}
