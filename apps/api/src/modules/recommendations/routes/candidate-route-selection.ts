import type { CandidateRoute } from "./candidate-route.js";

export type TravelTimeExclusion = Readonly<{
  candidateId: string;
  slug: string;
  code: "TRAVEL_TIME_EXCEEDED";
  durationMinutes: number;
  maximumMinutes: number;
}>;

export type CandidateRouteSelection = Readonly<{
  eligible: CandidateRoute[];
  excluded: TravelTimeExclusion[];
}>;
