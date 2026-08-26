import type { ScoreCurvePoint } from "../../../scoring/scoring.types.js";
import type { WeatherAgreementFactorName } from "./weather-model-agreement.types.js";

type AgreementFactorConfig = Readonly<{
  weight: number;
  curve: readonly ScoreCurvePoint[];
}>;

export const weatherAgreementFactorConfig: Record<
  WeatherAgreementFactorName,
  AgreementFactorConfig
> = {
  TEMPERATURE: {
    weight: 0.25,
    curve: [[0, 100], [1, 90], [3, 60], [6, 0]],
  },
  PRECIPITATION: {
    weight: 0.15,
    curve: [[0, 100], [0.2, 90], [1, 60], [3, 0]],
  },
  WIND_SPEED: {
    weight: 0.2,
    curve: [[0, 100], [1, 85], [3, 50], [6, 0]],
  },
  WIND_DIRECTION: {
    weight: 0.15,
    curve: [[0, 100], [20, 90], [45, 70], [90, 30], [180, 0]],
  },
  WIND_GUST: {
    weight: 0.1,
    curve: [[0, 100], [2, 80], [5, 45], [10, 0]],
  },
  CLOUD_COVER: {
    weight: 0.15,
    curve: [[0, 100], [15, 90], [40, 60], [80, 0]],
  },
};

export const weatherAgreementLevelThresholds = {
  high: 80,
  medium: 55,
} as const;
