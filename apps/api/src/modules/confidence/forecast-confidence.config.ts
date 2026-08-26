import type { ForecastConfidenceFactorName } from "./forecast-confidence.types.js";

export const forecastConfidenceWeights: Record<
  ForecastConfidenceFactorName,
  number
> = {
  FRESHNESS: 0.4,
  HORIZON: 0.25,
  COMPLETENESS: 0.35,
};

export const freshnessScoreCurve = [
  [0, 100],
  [3, 100],
  [6, 80],
  [12, 55],
  [24, 25],
  [36, 0],
] as const;

export const horizonScoreCurve = [
  [0, 100],
  [12, 100],
  [24, 90],
  [36, 75],
  [48, 60],
  [72, 35],
] as const;

export const confidenceLevelThresholds = {
  high: 80,
  medium: 55,
} as const;
