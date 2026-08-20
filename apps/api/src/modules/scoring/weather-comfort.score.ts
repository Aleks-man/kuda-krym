import { aggregateScore } from "./aggregate-score.js";
import { scoreByCurve } from "./score-curve.js";
import { scoringCurves, scoringWeights } from "./scoring.config.js";
import type { ConditionsScore, ScoreFactor } from "./scoring.types.js";

export type WeatherComfortInput = Readonly<{
  airTemperatureCelsius: number | null;
  precipitationProbabilityPercent: number | null;
  precipitationMillimeters: number | null;
  cloudCoverPercent: number | null;
}>;

export function scoreWeatherComfort(
  input: WeatherComfortInput,
): ConditionsScore {
  const factors: ScoreFactor[] = [
    createFactor("airTemperature", input.airTemperatureCelsius),
    createFactor(
      "precipitationProbability",
      input.precipitationProbabilityPercent,
    ),
    createFactor("precipitationAmount", input.precipitationMillimeters),
    createFactor("cloudCover", input.cloudCoverPercent),
  ];

  return aggregateScore(factors);
}

function createFactor(
  name: keyof typeof scoringWeights.weather,
  value: number | null,
): ScoreFactor {
  return {
    name,
    score: value === null ? null : scoreByCurve(value, scoringCurves[name]),
    weight: scoringWeights.weather[name],
  };
}
