import type { RecommendationContext } from "../context/recommendation-context.js";
import { filterRecommendationCandidates } from "./filter-recommendation-candidates.js";
import type { RecommendationCandidate } from "./recommendation-candidate.js";
import type { RecommendationCandidateRepository } from "./recommendation-candidate.repository.js";

export class RecommendationCandidateService {
  public constructor(
    private readonly repository: RecommendationCandidateRepository,
  ) {}

  public async listEligible(
    context: RecommendationContext,
  ): Promise<RecommendationCandidate[]> {
    const candidates = await this.repository.findPublished();
    return filterRecommendationCandidates(candidates, context);
  }
}
