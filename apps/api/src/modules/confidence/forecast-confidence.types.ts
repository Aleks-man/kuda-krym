export type ForecastConfidenceLevel = "LOW" | "MEDIUM" | "HIGH";

export type ForecastConfidenceFactorName =
  | "FRESHNESS"
  | "HORIZON"
  | "COMPLETENESS"
  | "MODEL_AGREEMENT";

export type ForecastConfidenceFactor = {
  name: ForecastConfidenceFactorName;
  score: number;
  weight: number;
};

export type ForecastConfidence = {
  score: number;
  level: ForecastConfidenceLevel;
  factors: ForecastConfidenceFactor[];
};

export type ForecastConfidenceInput = Readonly<{
  generatedAt: string;
  forecastTime: string;
  completenessPercent: number;
  modelAgreementPercent?: number | null;
  evaluatedAt?: Date;
}>;
