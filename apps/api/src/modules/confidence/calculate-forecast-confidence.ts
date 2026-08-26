import { scoreByCurve } from "../scoring/score-curve.js";
import {
  confidenceLevelThresholds,
  forecastConfidenceWeights,
  freshnessScoreCurve,
  horizonScoreCurve,
} from "./forecast-confidence.config.js";
import type {
  ForecastConfidence,
  ForecastConfidenceFactor,
  ForecastConfidenceInput,
  ForecastConfidenceLevel,
} from "./forecast-confidence.types.js";

const millisecondsPerHour = 60 * 60 * 1_000;

export function calculateForecastConfidence(
  input: ForecastConfidenceInput,
): ForecastConfidence {
  assertPercentage(input.completenessPercent);

  const evaluatedAt = input.evaluatedAt ?? new Date();
  const generatedAt = parseDate(input.generatedAt, "generatedAt");
  const forecastTime = parseDate(input.forecastTime, "forecastTime");
  const ageHours = nonnegativeHoursBetween(generatedAt, evaluatedAt);
  const horizonHours = nonnegativeHoursBetween(evaluatedAt, forecastTime);

  const factors: ForecastConfidenceFactor[] = [
    {
      name: "FRESHNESS",
      score: scoreByCurve(ageHours, freshnessScoreCurve),
      weight: forecastConfidenceWeights.FRESHNESS,
    },
    {
      name: "HORIZON",
      score: scoreByCurve(horizonHours, horizonScoreCurve),
      weight: forecastConfidenceWeights.HORIZON,
    },
    {
      name: "COMPLETENESS",
      score: Math.round(input.completenessPercent),
      weight: forecastConfidenceWeights.COMPLETENESS,
    },
  ];
  const score = Math.round(
    factors.reduce(
      (total, factor) => total + factor.score * factor.weight,
      0,
    ),
  );

  return { score, level: resolveConfidenceLevel(score), factors };
}

function parseDate(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} must be a valid ISO date`);
  }
  return date;
}

function assertPercentage(value: number): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error("completenessPercent must be between 0 and 100");
  }
}

function nonnegativeHoursBetween(earlier: Date, later: Date): number {
  return Math.max(0, (later.getTime() - earlier.getTime()) / millisecondsPerHour);
}

function resolveConfidenceLevel(score: number): ForecastConfidenceLevel {
  if (score >= confidenceLevelThresholds.high) return "HIGH";
  if (score >= confidenceLevelThresholds.medium) return "MEDIUM";
  return "LOW";
}
