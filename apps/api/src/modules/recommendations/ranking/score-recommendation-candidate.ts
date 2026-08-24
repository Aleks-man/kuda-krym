import { scoreByCurve } from "../../scoring/score-curve.js";
import { scoringCurves } from "../../scoring/scoring.config.js";
import type { RecommendationContext } from "../context/recommendation-context.js";
import type { CandidateWindowSummary } from "../summaries/candidate-window-summary.js";
import {
  confidencePenalty,
  recommendationRankingWeights,
} from "./recommendation-ranking.config.js";
import type {
  RankedRecommendation,
  RankingComponent,
  RankingComponentName,
} from "./recommendation-ranking.js";

type UnpositionedRecommendation = Omit<RankedRecommendation, "position">;

export function scoreRecommendationCandidate(
  summary: CandidateWindowSummary,
  priority: RecommendationContext["priority"],
): UnpositionedRecommendation | null {
  const components = createComponents(summary, priority);
  const available = components.filter(
    (component): component is RankingComponent & { score: number } =>
      component.score !== null,
  );
  const availableWeight = available.reduce(
    (sum, component) => sum + component.weight,
    0,
  );
  if (availableWeight === 0) return null;

  const rawScore = Math.round(
    available.reduce(
      (sum, component) => sum + component.score * component.weight,
      0,
    ) / availableWeight,
  );
  const confidencePercent = Math.round(
    components.reduce(
      (sum, component) =>
        sum + component.weight * component.coveragePercent,
      0,
    ),
  );
  const confidenceFactor =
    confidencePenalty.minimumMultiplier +
    confidencePenalty.coverageMultiplier * (confidencePercent / 100);

  return {
    candidate: summary.candidate,
    visitWindow: summary.visitWindow,
    hourCount: summary.hourCount,
    score: Math.round(rawScore * confidenceFactor),
    rawScore,
    confidencePercent,
    priority,
    components,
    averages: summary.averages,
  };
}

function createComponents(
  summary: CandidateWindowSummary,
  priority: RecommendationContext["priority"],
): RankingComponent[] {
  const weights = recommendationRankingWeights[priority];
  const values: Record<
    RankingComponentName,
    Readonly<{ score: number | null; coveragePercent: number }>
  > = {
    SEA: {
      score: summary.scores.sea,
      coveragePercent: summary.scores.seaCoveragePercent,
    },
    WEATHER: {
      score: summary.scores.weather,
      coveragePercent: summary.scores.weatherCoveragePercent,
    },
    WARM_WATER: {
      score:
        summary.averages.seaSurfaceTemperatureCelsius === null
          ? null
          : scoreByCurve(
              summary.averages.seaSurfaceTemperatureCelsius,
              scoringCurves.waterTemperature,
            ),
      coveragePercent:
        summary.averages.seaSurfaceTemperatureCelsius === null ? 0 : 100,
    },
  };

  return (Object.entries(weights) as [RankingComponentName, number][]).map(
    ([name, weight]) => ({ name, weight, ...values[name] }),
  );
}
