import type { RecommendationRequest } from "@kuda-krym/contracts";

import { createDeadline, waitForSignal } from "../../shared/async/abort.js";
import { HttpError } from "../../shared/http/http-error.js";
import type { RecommendationCandidateService } from "./candidates/recommendation-candidate.service.js";
import { normalizeRecommendationRequest } from "./context/normalize-recommendation-request.js";
import type { CandidateForecastLoader } from "./forecasts/candidate-forecast.loader.js";
import { rankRecommendationCandidates } from "./ranking/rank-recommendation-candidates.js";
import type { RecommendationCalculation } from "./recommendation-calculation.js";
import type { CandidateRouteLoader } from "./routes/candidate-route.loader.js";
import { filterCandidateRoutes } from "./routes/filter-candidate-routes.js";
import { summarizeCandidateWindows } from "./summaries/candidate-window-summarizer.js";

type RecommendationServiceDependencies = Readonly<{
  candidateService: Pick<RecommendationCandidateService, "listEligible">;
  forecastLoader: Pick<CandidateForecastLoader, "load">;
  routeLoader: Pick<CandidateRouteLoader, "load">;
  now?: () => Date;
  timeoutMs?: number;
  routeTimeoutMs?: number;
}>;

export class RecommendationService {
  private readonly now: () => Date;

  public constructor(private readonly dependencies: RecommendationServiceDependencies) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async calculate(
    request: RecommendationRequest,
    signal?: AbortSignal,
  ): Promise<RecommendationCalculation> {
    signal?.throwIfAborted();
    const context = normalizeRecommendationRequest(request, this.now());
    const deadline = createDeadline(this.dependencies.timeoutMs ?? 20_000, signal);
    // Reserve time for forecasts even when the routing provider is slow.
    const routeDeadline = createDeadline(this.dependencies.routeTimeoutMs ?? 10_000, deadline.signal);
    try {
      const candidates = await waitForSignal(
        this.dependencies.candidateService.listEligible(), deadline.signal,
      );
      const routes = await this.dependencies.routeLoader.load(candidates, {
        latitude: context.origin.latitude,
        longitude: context.origin.longitude,
      }, routeDeadline.signal);
      routeDeadline.dispose();
      const routeSelection = filterCandidateRoutes(routes.available, context.maxTravelMinutes);
      const forecasts = await this.dependencies.forecastLoader.load(
        routeSelection.eligible.map(({ candidate }) => candidate),
        context.forecastDays,
        deadline.signal,
      );
      signal?.throwIfAborted();
      const summaries = summarizeCandidateWindows(forecasts, context);
      const ranking = rankRecommendationCandidates(summaries, context.priority, 10);
      const failures = [...routes.failures, ...routeSelection.excluded, ...ranking.failures];

      return {
        context,
        recommendations: ranking.recommendations,
        candidateRoutes: routeSelection.eligible,
        failures,
        meta: {
          candidateCount: candidates.length,
          recommendationCount: ranking.recommendations.length,
          failureCount: failures.length,
          ...(routeDeadline.signal.aborted || deadline.signal.aborted ? { timedOut: true } : {}),
        },
      };
    } catch (error) {
      signal?.throwIfAborted();
      if (!deadline.signal.aborted) throw error;
      throw new HttpError({
        status: 504,
        code: "RECOMMENDATIONS_TIMEOUT",
        message: "Не удалось завершить подбор вовремя. Попробуйте ещё раз.",
        cause: error,
      });
    } finally {
      routeDeadline.dispose();
      deadline.dispose();
    }
  }
}
