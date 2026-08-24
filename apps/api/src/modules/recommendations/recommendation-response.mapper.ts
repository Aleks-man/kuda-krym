import type { RecommendationResponse } from "@kuda-krym/contracts";

import type { RecommendationCalculation } from "./recommendation-calculation.js";

export function mapRecommendationResponse(
  calculation: RecommendationCalculation,
): RecommendationResponse {
  return {
    data: calculation.recommendations.map((recommendation) => ({
      position: recommendation.position,
      beach: {
        id: recommendation.candidate.id,
        slug: recommendation.candidate.slug,
        name: recommendation.candidate.name,
        coordinates: {
          latitude: recommendation.candidate.latitude,
          longitude: recommendation.candidate.longitude,
        },
        surface: recommendation.candidate.surface,
        childSuitability: recommendation.candidate.childSuitability,
      },
      score: recommendation.score,
      rawScore: recommendation.rawScore,
      confidencePercent: recommendation.confidencePercent,
      hourCount: recommendation.hourCount,
      components: recommendation.components,
      conditions: recommendation.averages,
    })),
    context: {
      origin: {
        code: calculation.context.origin.code,
        name: calculation.context.origin.name,
      },
      date: calculation.context.date,
      visitWindow: calculation.context.visitWindow,
      priority: calculation.context.priority,
    },
    meta: {
      candidateCount: calculation.meta.candidateCount,
      recommendationCount: calculation.meta.recommendationCount,
      unavailableCount: calculation.meta.failureCount,
    },
  };
}
