import type { RecommendationContext } from "./context/recommendation-context.js";
import type {
  RecommendationRankingFailure,
  RankedRecommendation,
} from "./ranking/recommendation-ranking.js";
import type {
  CandidateRoute,
  CandidateRouteFailure,
} from "./routes/candidate-route.js";
import type { TravelTimeExclusion } from "./routes/candidate-route-selection.js";

export type RecommendationFailure =
  | RecommendationRankingFailure
  | CandidateRouteFailure
  | TravelTimeExclusion;

export type RecommendationCalculation = Readonly<{
  context: RecommendationContext;
  recommendations: RankedRecommendation[];
  candidateRoutes: CandidateRoute[];
  failures: RecommendationFailure[];
  meta: Readonly<{
    candidateCount: number;
    recommendationCount: number;
    failureCount: number;
  }>;
}>;
