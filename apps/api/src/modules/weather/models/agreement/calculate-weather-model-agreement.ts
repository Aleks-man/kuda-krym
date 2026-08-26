import { scoreByCurve } from "../../../scoring/score-curve.js";
import type { AlignedWeatherModelHour } from "../comparison/weather-model-alignment.js";
import { calculateCircularSpread } from "./calculate-circular-spread.js";
import {
  weatherAgreementFactorConfig,
  weatherAgreementLevelThresholds,
} from "./weather-model-agreement.config.js";
import type {
  WeatherAgreementFactor,
  WeatherAgreementFactorName,
  WeatherAgreementLevel,
  WeatherAgreementUnit,
  WeatherModelAgreement,
} from "./weather-model-agreement.types.js";

export function calculateWeatherModelAgreement(
  hour: AlignedWeatherModelHour,
): WeatherModelAgreement {
  if (hour.samples.length < 2) {
    return {
      time: hour.time,
      modelCount: hour.samples.length,
      score: null,
      level: "INSUFFICIENT_DATA",
      factors: [],
    };
  }

  const conditions = hour.samples.map((sample) => sample.conditions);
  const factors = [
    createFactor("TEMPERATURE", "CELSIUS", range(conditions.map((item) => item.temperatureCelsius))),
    createFactor("PRECIPITATION", "MILLIMETERS", range(conditions.map((item) => item.precipitationMillimeters))),
    createFactor("WIND_SPEED", "MPS", range(conditions.map((item) => item.windSpeedMetersPerSecond))),
    createFactor("WIND_DIRECTION", "DEGREES", calculateCircularSpread(conditions.map((item) => item.windDirectionDegrees))),
    createFactor("WIND_GUST", "MPS", range(conditions.map((item) => item.windGustMetersPerSecond))),
    createFactor("CLOUD_COVER", "PERCENT", range(conditions.map((item) => item.cloudCoverPercent))),
  ];
  const score = Math.round(
    factors.reduce(
      (total, factor) => total + factor.score * factor.weight,
      0,
    ),
  );

  return {
    time: hour.time,
    modelCount: hour.samples.length,
    score,
    level: resolveLevel(score),
    factors,
  };
}

export function calculateWeatherModelAgreements(
  hours: readonly AlignedWeatherModelHour[],
): WeatherModelAgreement[] {
  return hours.map(calculateWeatherModelAgreement);
}

function createFactor(
  name: WeatherAgreementFactorName,
  unit: WeatherAgreementUnit,
  spread: number,
): WeatherAgreementFactor {
  const config = weatherAgreementFactorConfig[name];
  return {
    name,
    unit,
    spread,
    score: scoreByCurve(spread, config.curve),
    weight: config.weight,
  };
}

function range(values: readonly number[]): number {
  return Math.max(...values) - Math.min(...values);
}

function resolveLevel(score: number): WeatherAgreementLevel {
  if (score >= weatherAgreementLevelThresholds.high) return "HIGH";
  if (score >= weatherAgreementLevelThresholds.medium) return "MEDIUM";
  return "LOW";
}
