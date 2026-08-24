import { mapForecastHours } from "../../forecast/forecast-hour.mapper.js";
import type { RecommendationContext } from "../context/recommendation-context.js";
import type { CandidateForecastBatch } from "../forecasts/candidate-forecast.js";
import { averageValues } from "./average-values.js";
import type {
  CandidateWindowBatch,
  CandidateWindowSummary,
} from "./candidate-window-summary.js";
import { selectForecastWindow } from "./select-forecast-window.js";

export function summarizeCandidateWindows(
  forecasts: CandidateForecastBatch,
  context: RecommendationContext,
): CandidateWindowBatch {
  return forecasts.available.reduce<CandidateWindowBatch>(
    (batch, forecast) => {
      const hourly = selectForecastWindow(
        mapForecastHours(forecast.weather, forecast.marine),
        context.visitWindow,
      );

      if (hourly.length === 0) {
        batch.failures.push({
          candidateId: forecast.candidate.id,
          slug: forecast.candidate.slug,
          code: "NO_FORECAST_IN_VISIT_WINDOW",
        });
        return batch;
      }

      batch.available.push(
        createSummary(forecast.candidate, context.visitWindow, hourly),
      );
      return batch;
    },
    { available: [], failures: [...forecasts.failures] },
  );
}

function createSummary(
  candidate: CandidateWindowSummary["candidate"],
  visitWindow: RecommendationContext["visitWindow"],
  hourly: ReturnType<typeof mapForecastHours>,
): CandidateWindowSummary {
  return {
    candidate,
    visitWindow,
    hourCount: hourly.length,
    scores: {
      sea: averageValues(hourly.map((hour) => hour.scores.sea.score)),
      weather: averageValues(hourly.map((hour) => hour.scores.weather.score)),
      seaCoveragePercent:
        averageValues(
          hourly.map((hour) => hour.scores.sea.coveragePercent),
        ) ?? 0,
      weatherCoveragePercent:
        averageValues(
          hourly.map((hour) => hour.scores.weather.coveragePercent),
        ) ?? 0,
    },
    averages: {
      airTemperatureCelsius: averageValues(
        hourly.map((hour) => hour.weather.temperatureCelsius),
      ),
      seaSurfaceTemperatureCelsius: averageValues(
        hourly.map((hour) => hour.marine.seaSurfaceTemperatureCelsius),
      ),
      waveHeightMeters: averageValues(
        hourly.map((hour) => hour.marine.waveHeightMeters),
      ),
      windSpeedMetersPerSecond: averageValues(
        hourly.map((hour) => hour.weather.windSpeedMetersPerSecond),
      ),
      precipitationProbabilityPercent: averageValues(
        hourly.map(
          (hour) => hour.weather.precipitationProbabilityPercent,
        ),
      ),
    },
  };
}
