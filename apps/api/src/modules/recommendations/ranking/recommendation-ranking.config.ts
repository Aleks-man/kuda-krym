import type { RecommendationContext } from "../context/recommendation-context.js";
import type { RankingComponentName } from "./recommendation-ranking.js";

export const recommendationRankingWeights: Record<
  RecommendationContext["priority"],
  Partial<Record<RankingComponentName, number>>
> = {
  CALM_SEA: { SEA: 0.65, WEATHER: 0.35 },
  WARM_WATER: { SEA: 0.35, WEATHER: 0.25, WARM_WATER: 0.4 },
  COMFORT: { SEA: 0.35, WEATHER: 0.65 },
};

export const confidencePenalty = {
  minimumMultiplier: 0.7,
  coverageMultiplier: 0.3,
} as const;
