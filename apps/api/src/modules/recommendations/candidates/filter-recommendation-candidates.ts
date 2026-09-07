import type { RecommendationContext } from "../context/recommendation-context.js";
import type { RecommendationCandidate } from "./recommendation-candidate.js";

type CandidatePreferences = Pick<RecommendationContext, "preferredSurface">;

export function filterRecommendationCandidates(
  candidates: RecommendationCandidate[],
  preferences: CandidatePreferences,
): RecommendationCandidate[] {
  return candidates.filter((candidate) =>
    matchesSurface(candidate, preferences.preferredSurface),
  );
}

function matchesSurface(
  candidate: RecommendationCandidate,
  preferredSurface: RecommendationContext["preferredSurface"],
): boolean {
  return preferredSurface === "ANY" || candidate.surface === preferredSurface;
}
