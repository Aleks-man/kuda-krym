import type { RecommendationContext } from "./context/recommendation-context.js";
import type {
  RecommendationRankingFailure,
  RankedRecommendation,
} from "./ranking/recommendation-ranking.js";

export type RecommendationCalculation = Readonly<{
  context: RecommendationContext;
  recommendations: RankedRecommendation[];
  failures: RecommendationRankingFailure[];
  meta: Readonly<{
    candidateCount: number;
    recommendationCount: number;
    failureCount: number;
  }>;
}>;
