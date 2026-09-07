import type { RecommendationCandidate } from "./recommendation-candidate.js";
import type { RecommendationCandidateRepository } from "./recommendation-candidate.repository.js";

export class RecommendationCandidateService {
  public constructor(
    private readonly repository: RecommendationCandidateRepository,
  ) {}

  public async listEligible(): Promise<RecommendationCandidate[]> {
    return this.repository.findPublished();
  }
}
