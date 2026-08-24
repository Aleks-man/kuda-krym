import type { RecommendationContext } from "../context/recommendation-context.js";
import type {
  CandidateWindowFailure,
  CandidateWindowSummary,
} from "../summaries/candidate-window-summary.js";

export type RankingComponentName = "SEA" | "WEATHER" | "WARM_WATER";

export type RankingComponent = Readonly<{
  name: RankingComponentName;
  score: number | null;
  coveragePercent: number;
  weight: number;
}>;

export type RankedRecommendation = Readonly<{
  position: number;
  candidate: CandidateWindowSummary["candidate"];
  visitWindow: CandidateWindowSummary["visitWindow"];
  hourCount: number;
  score: number;
  rawScore: number;
  confidencePercent: number;
  priority: RecommendationContext["priority"];
  components: RankingComponent[];
  averages: CandidateWindowSummary["averages"];
}>;

export type RecommendationRankingFailure =
  | CandidateWindowFailure
  | Readonly<{
      candidateId: string;
      slug: string;
      code: "INSUFFICIENT_SCORE_DATA";
    }>;

export type RecommendationRankingBatch = Readonly<{
  recommendations: RankedRecommendation[];
  failures: RecommendationRankingFailure[];
}>;
