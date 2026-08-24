import type { RecommendationCandidate } from "../candidates/recommendation-candidate.js";
import type { RecommendationContext } from "../context/recommendation-context.js";
import type { CandidateForecastFailure } from "../forecasts/candidate-forecast.js";

export type CandidateWindowSummary = Readonly<{
  candidate: RecommendationCandidate;
  visitWindow: RecommendationContext["visitWindow"];
  hourCount: number;
  scores: Readonly<{
    sea: number | null;
    weather: number | null;
    seaCoveragePercent: number;
    weatherCoveragePercent: number;
  }>;
  averages: Readonly<{
    airTemperatureCelsius: number | null;
    seaSurfaceTemperatureCelsius: number | null;
    waveHeightMeters: number | null;
    windSpeedMetersPerSecond: number | null;
    precipitationProbabilityPercent: number | null;
  }>;
}>;

export type CandidateWindowFailure =
  | CandidateForecastFailure
  | Readonly<{
      candidateId: string;
      slug: string;
      code: "NO_FORECAST_IN_VISIT_WINDOW";
    }>;

export type CandidateWindowBatch = Readonly<{
  available: CandidateWindowSummary[];
  failures: CandidateWindowFailure[];
}>;
