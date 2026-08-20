import type { ScoreCurvePoint } from "./scoring.types.js";

export const scoringCurves = {
  waveHeight: [[0, 100], [0.3, 100], [0.6, 75], [1, 35], [1.5, 0]],
  windSpeed: [[0, 100], [3, 100], [6, 75], [9, 40], [13, 0]],
  waterTemperature: [[10, 0], [18, 45], [23, 90], [27, 100], [30, 75], [34, 20]],
  windGust: [[0, 100], [5, 100], [9, 65], [14, 20], [18, 0]],
  airTemperature: [[8, 0], [18, 70], [23, 100], [28, 90], [33, 50], [38, 0]],
  precipitationProbability: [[0, 100], [20, 90], [40, 65], [70, 25], [100, 0]],
  precipitationAmount: [[0, 100], [0.2, 90], [1, 50], [3, 10], [6, 0]],
  cloudCover: [[0, 85], [20, 100], [50, 85], [80, 60], [100, 40]],
} satisfies Record<string, readonly ScoreCurvePoint[]>;

export const scoringWeights = {
  sea: {
    waveHeight: 0.4,
    windSpeed: 0.3,
    waterTemperature: 0.2,
    windGust: 0.1,
  },
  weather: {
    airTemperature: 0.4,
    precipitationProbability: 0.3,
    precipitationAmount: 0.2,
    cloudCover: 0.1,
  },
} as const;
