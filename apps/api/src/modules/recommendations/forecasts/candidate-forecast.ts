import type { MarineForecast } from "../../marine/marine-forecast.js";
import type { WeatherForecast } from "../../weather/weather-forecast.js";
import type { RecommendationCandidate } from "../candidates/recommendation-candidate.js";

export type CandidateForecast = Readonly<{
  candidate: RecommendationCandidate;
  weather: WeatherForecast;
  marine: MarineForecast;
}>;

export type CandidateForecastFailure = Readonly<{
  candidateId: string;
  slug: string;
  code: "FORECAST_UNAVAILABLE";
}>;

export type CandidateForecastBatch = Readonly<{
  available: CandidateForecast[];
  failures: CandidateForecastFailure[];
}>;
