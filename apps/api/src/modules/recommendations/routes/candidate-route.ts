import type { DrivingRoute } from "../../routing/route.js";
import type { RecommendationCandidate } from "../candidates/recommendation-candidate.js";

export type CandidateRoute = Readonly<{
  candidate: RecommendationCandidate;
  route: DrivingRoute;
}>;

export type CandidateRouteFailure = Readonly<{
  candidateId: string;
  slug: string;
  code: "ROUTE_UNAVAILABLE";
}>;

export type CandidateRouteBatch = Readonly<{
  available: CandidateRoute[];
  failures: CandidateRouteFailure[];
}>;
