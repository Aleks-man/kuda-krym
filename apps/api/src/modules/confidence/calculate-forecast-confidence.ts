import { scoreByCurve } from "../scoring/score-curve.js";
import {
  confidenceLevelThresholds,
  baseForecastConfidenceWeights,
  freshnessScoreCurve,
  horizonScoreCurve,
  modelAgreementWeight,
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
  if (
    input.modelAgreementPercent !== undefined &&
    input.modelAgreementPercent !== null
  ) {
    assertPercentage(input.modelAgreementPercent, "modelAgreementPercent");
  }

  const evaluatedAt = input.evaluatedAt ?? new Date();
  const generatedAt = parseDate(input.generatedAt, "generatedAt");
  const forecastTime = parseDate(input.forecastTime, "forecastTime");
  const ageHours = nonnegativeHoursBetween(generatedAt, evaluatedAt);
  const horizonHours = nonnegativeHoursBetween(evaluatedAt, forecastTime);

  const modelAgreement = input.modelAgreementPercent;
  const hasModelAgreement = typeof modelAgreement === "number";
  const baseWeightMultiplier = hasModelAgreement
    ? 1 - modelAgreementWeight
    : 1;
  const factors: ForecastConfidenceFactor[] = [
    {
      name: "FRESHNESS",
      score: scoreByCurve(ageHours, freshnessScoreCurve),
      weight: scaleWeight(
        baseForecastConfidenceWeights.FRESHNESS,
        baseWeightMultiplier,
      ),
    },
    {
      name: "HORIZON",
      score: scoreByCurve(horizonHours, horizonScoreCurve),
      weight: scaleWeight(
        baseForecastConfidenceWeights.HORIZON,
        baseWeightMultiplier,
      ),
    },
    {
      name: "COMPLETENESS",
      score: Math.round(input.completenessPercent),
      weight: scaleWeight(
        baseForecastConfidenceWeights.COMPLETENESS,
        baseWeightMultiplier,
      ),
    },
  ];
  if (typeof modelAgreement === "number") {
    factors.push({
      name: "MODEL_AGREEMENT",
      score: Math.round(modelAgreement),
      weight: modelAgreementWeight,
    });
  }
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

function assertPercentage(
  value: number,
  field = "completenessPercent",
): void {
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${field} must be between 0 and 100`);
  }
}

function nonnegativeHoursBetween(earlier: Date, later: Date): number {
  return Math.max(0, (later.getTime() - earlier.getTime()) / millisecondsPerHour);
}

function scaleWeight(weight: number, multiplier: number): number {
  return Math.round(weight * multiplier * 1_000) / 1_000;
}

function resolveConfidenceLevel(score: number): ForecastConfidenceLevel {
  if (score >= confidenceLevelThresholds.high) return "HIGH";
  if (score >= confidenceLevelThresholds.medium) return "MEDIUM";
  return "LOW";
}
