import type { RecommendationCandidate } from "./recommendation-candidate.js";

export interface RecommendationCandidateRepository {
  findPublished(): Promise<RecommendationCandidate[]>;
}
