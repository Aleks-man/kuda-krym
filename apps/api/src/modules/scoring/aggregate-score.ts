import type { ConditionsScore, ScoreFactor } from "./scoring.types.js";

export function aggregateScore(factors: ScoreFactor[]): ConditionsScore {
  const totalWeight = factors.reduce((sum, factor) => sum + factor.weight, 0);
  const available = factors.filter((factor) => factor.score !== null);
  const availableWeight = available.reduce(
    (sum, factor) => sum + factor.weight,
    0,
  );

  if (totalWeight <= 0) throw new Error("Scoring factors require positive weight");

  return {
    score:
      availableWeight === 0
        ? null
        : Math.round(
            available.reduce(
              (sum, factor) => sum + factor.score! * factor.weight,
              0,
            ) / availableWeight,
          ),
    coveragePercent: Math.round((availableWeight / totalWeight) * 100),
    factors,
  };
}
