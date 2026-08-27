import type { ForecastSourceFreshness } from "@kuda-krym/contracts";

export type MarineForecastRequest = Readonly<{
  location: Readonly<{ latitude: number; longitude: number }>;
  days: 1 | 2;
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
