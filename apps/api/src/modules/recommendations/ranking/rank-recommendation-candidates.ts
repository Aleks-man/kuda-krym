import type { RecommendationContext } from "../context/recommendation-context.js";
import type { CandidateWindowBatch } from "../summaries/candidate-window-summary.js";
import type {
  RecommendationRankingBatch,
  RecommendationRankingFailure,
  RankedRecommendation,
} from "./recommendation-ranking.js";
import { scoreRecommendationCandidate } from "./score-recommendation-candidate.js";

export function rankRecommendationCandidates(
  summaries: CandidateWindowBatch,
  priority: RecommendationContext["priority"],
  limit = 3,
): RecommendationRankingBatch {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("Recommendation limit must be a positive integer");
  }

  const ranked: Omit<RankedRecommendation, "position">[] = [];
  const failures: RecommendationRankingFailure[] = [...summaries.failures];

  for (const summary of summaries.available) {
    const recommendation = scoreRecommendationCandidate(summary, priority);
    if (recommendation) {
      ranked.push(recommendation);
    } else {
      failures.push({
        candidateId: summary.candidate.id,
        slug: summary.candidate.slug,
        code: "INSUFFICIENT_SCORE_DATA",
      });
    }
  }

  const recommendations = ranked
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.confidencePercent - left.confidencePercent ||
        left.candidate.slug.localeCompare(right.candidate.slug),
    )
    .slice(0, limit)
    .map((recommendation, index) => ({
      ...recommendation,
      position: index + 1,
    }));

  return { recommendations, failures };
}
