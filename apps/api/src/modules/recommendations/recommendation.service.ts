import type { RecommendationRequest } from "@kuda-krym/contracts";

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
}>;

export class RecommendationService {
  private readonly now: () => Date;

  public constructor(
    private readonly dependencies: RecommendationServiceDependencies,
  ) {
    this.now = dependencies.now ?? (() => new Date());
  }

  public async calculate(
    request: RecommendationRequest,
  ): Promise<RecommendationCalculation> {
    const context = normalizeRecommendationRequest(request, this.now());
    const candidates = await this.dependencies.candidateService.listEligible(
      context,
    );
    const routes = await this.dependencies.routeLoader.load(candidates, {
      latitude: context.origin.latitude,
      longitude: context.origin.longitude,
    });
    const routeSelection = filterCandidateRoutes(
      routes.available,
      context.maxTravelMinutes,
    );
    const routeEligibleCandidates = routeSelection.eligible.map(
      ({ candidate }) => candidate,
    );
    const forecasts = await this.dependencies.forecastLoader.load(
      routeEligibleCandidates,
      context.forecastDays,
    );
    const summaries = summarizeCandidateWindows(forecasts, context);
    const ranking = rankRecommendationCandidates(
      summaries,
      context.priority,
    );

    return {
      context,
      recommendations: ranking.recommendations,
      candidateRoutes: routeSelection.eligible,
      failures: [
        ...routes.failures,
        ...routeSelection.excluded,
        ...ranking.failures,
      ],
      meta: {
        candidateCount: candidates.length,
        recommendationCount: ranking.recommendations.length,
        failureCount:
          routes.failures.length +
          routeSelection.excluded.length +
          ranking.failures.length,
      },
    };
  }
}
