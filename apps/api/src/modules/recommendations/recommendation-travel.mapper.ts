import type { RecommendationResponse } from "@kuda-krym/contracts";
import type { CandidateRoute } from "./routes/candidate-route.js";

type RecommendationTravel = RecommendationResponse["data"][number]["travel"];

export function mapRecommendationTravel(
  candidateId: string,
  candidateRoutes: readonly CandidateRoute[],
): RecommendationTravel {
  const candidateRoute = candidateRoutes.find(
    ({ candidate }) => candidate.id === candidateId,
  );

  if (!candidateRoute) {
    throw new Error(`Route is missing for recommendation ${candidateId}`);
  }

  return {
    distanceMeters: candidateRoute.route.distanceMeters,
    durationMinutes: Math.ceil(candidateRoute.route.durationSeconds / 60),
  };
}
