import { aggregateScore } from "./aggregate-score.js";
import { scoreByCurve } from "./score-curve.js";
import { scoringCurves, scoringWeights } from "./scoring.config.js";
import type { ConditionsScore, ScoreFactor } from "./scoring.types.js";

export type SeaConditionsInput = Readonly<{
  waveHeightMeters: number | null;
  windSpeedMetersPerSecond: number | null;
  waterTemperatureCelsius: number | null;
  windGustMetersPerSecond: number | null;
}>;

export function scoreSeaConditions(input: SeaConditionsInput): ConditionsScore {
  const factors: ScoreFactor[] = [
    createFactor("waveHeight", input.waveHeightMeters),
    createFactor("windSpeed", input.windSpeedMetersPerSecond),
    createFactor("waterTemperature", input.waterTemperatureCelsius),
    createFactor("windGust", input.windGustMetersPerSecond),
  ];

  return aggregateScore(factors);
}

function createFactor(
  name: keyof typeof scoringWeights.sea,
  value: number | null,
): ScoreFactor {
  return {
    name,
    score: value === null ? null : scoreByCurve(value, scoringCurves[name]),
    weight: scoringWeights.sea[name],
  };
}
