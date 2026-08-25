import type { CandidateRoute } from "./candidate-route.js";
import type {
  CandidateRouteSelection,
  TravelTimeExclusion,
} from "./candidate-route-selection.js";

export function filterCandidateRoutes(
  candidateRoutes: readonly CandidateRoute[],
  maximumMinutes: number,
): CandidateRouteSelection {
  const eligible: CandidateRoute[] = [];
  const excluded: TravelTimeExclusion[] = [];

  for (const candidateRoute of candidateRoutes) {
    const durationMinutes = Math.ceil(
      candidateRoute.route.durationSeconds / 60,
    );

    if (durationMinutes <= maximumMinutes) {
      eligible.push(candidateRoute);
      continue;
    }

    excluded.push({
      candidateId: candidateRoute.candidate.id,
      slug: candidateRoute.candidate.slug,
      code: "TRAVEL_TIME_EXCEEDED",
      durationMinutes,
      maximumMinutes,
    });
  }

  return { eligible, excluded };
}
