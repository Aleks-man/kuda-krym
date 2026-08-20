import type { RecommendationContext } from "../context/recommendation-context.js";
import type { RecommendationCandidate } from "./recommendation-candidate.js";

type CandidatePreferences = Pick<
  RecommendationContext,
  "company" | "preferredSurface"
>;

export function filterRecommendationCandidates(
  candidates: RecommendationCandidate[],
  preferences: CandidatePreferences,
): RecommendationCandidate[] {
  return candidates.filter(
    (candidate) =>
      matchesSurface(candidate, preferences.preferredSurface) &&
      matchesCompany(candidate, preferences.company),
  );
}

function matchesSurface(
  candidate: RecommendationCandidate,
  preferredSurface: RecommendationContext["preferredSurface"],
): boolean {
  return preferredSurface === "ANY" || candidate.surface === preferredSurface;
}

function matchesCompany(
  candidate: RecommendationCandidate,
  company: RecommendationContext["company"],
): boolean {
  return company !== "WITH_CHILDREN" || candidate.childSuitability === "SUITABLE";
}
