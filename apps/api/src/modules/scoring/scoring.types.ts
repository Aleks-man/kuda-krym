export type ScoreFactorName =
  | "waveHeight"
  | "windSpeed"
  | "waterTemperature"
  | "windGust"
  | "airTemperature"
  | "precipitationProbability"
  | "precipitationAmount"
  | "cloudCover";

export type ScoreFactor = Readonly<{
  name: ScoreFactorName;
  score: number | null;
  weight: number;
}>;

export type ConditionsScore = Readonly<{
  score: number | null;
  coveragePercent: number;
  factors: ScoreFactor[];
}>;

export type ScoreCurvePoint = readonly [value: number, score: number];
