import { mapForecastFreshness } from "../../forecast/freshness/forecast-freshness.mapper.js";
import { freshnessScoreCurve } from "../../confidence/forecast-confidence.config.js";
import { scoreByCurve } from "../../scoring/score-curve.js";
import { staleRecommendationFreshnessCap } from "../ranking/recommendation-ranking.config.js";
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
  evaluatedAt = new Date(),
): CandidateWindowBatch {
  return forecasts.available.reduce<CandidateWindowBatch>(
    (batch, forecast) => {
      const hourly = selectForecastWindow(
        mapForecastHours(forecast.weather, forecast.marine, { evaluatedAt }),
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
        createSummary(
          forecast.candidate, context.visitWindow, hourly,
          mapForecastFreshness(forecast.weather, forecast.marine, null), evaluatedAt,
        ),
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
  freshness: CandidateWindowSummary["freshness"],
  evaluatedAt: Date,
): CandidateWindowSummary {
  const oldestGeneratedAt = Math.min(
    Date.parse(freshness.sources.weather.generatedAt),
    Date.parse(freshness.sources.marine!.generatedAt),
  );
  const ageHours = Math.max(0, (evaluatedAt.getTime() - oldestGeneratedAt) / 3_600_000);
  const freshnessPercent = Math.min(
    scoreByCurve(ageHours, freshnessScoreCurve),
    freshness.status === "STALE" ? staleRecommendationFreshnessCap : 100,
  );
  return {
    candidate,
    visitWindow,
    hourCount: hourly.length,
    freshness,
    freshnessPercent,
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
