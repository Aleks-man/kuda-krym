export type ForecastConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export type ForecastConfidenceFactorName =
  | "FRESHNESS"
  | "HORIZON"
  | "COMPLETENESS";

export type ForecastConfidenceFactor = Readonly<{
  name: ForecastConfidenceFactorName;
  score: number;
  weight: number;
}>;

export type ForecastConfidence = Readonly<{
  score: number;
  level: ForecastConfidenceLevel;
  factors: readonly ForecastConfidenceFactor[];
}>;

export type ForecastConfidenceInput = Readonly<{
  generatedAt: string;
  forecastTime: string;
  completenessPercent: number;
  evaluatedAt?: Date;
}>;
