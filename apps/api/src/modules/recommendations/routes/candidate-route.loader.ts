import { mapWithConcurrency } from "../../../shared/async/map-with-concurrency.js";
import type { RoutePoint, RoutingProvider } from "../../routing/route.js";
import type { RecommendationCandidate } from "../candidates/recommendation-candidate.js";
import type {
  CandidateRoute,
  CandidateRouteBatch,
  CandidateRouteFailure,
} from "./candidate-route.js";

type CandidateRouteLoaderDependencies = Readonly<{
  routingProvider: RoutingProvider;
  concurrency?: number;
}>;

type CandidateRouteResult =
  | Readonly<{ status: "available"; candidateRoute: CandidateRoute }>
  | Readonly<{ status: "failed"; failure: CandidateRouteFailure }>;

export class CandidateRouteLoader {
  private readonly concurrency: number;

  public constructor(
    private readonly dependencies: CandidateRouteLoaderDependencies,
  ) {
    this.concurrency = dependencies.concurrency ?? 2;
  }

  public async load(
    candidates: readonly RecommendationCandidate[],
    origin: RoutePoint,
  ): Promise<CandidateRouteBatch> {
    const results = await mapWithConcurrency(
      candidates,
      this.concurrency,
      (candidate) => this.loadCandidate(candidate, origin),
    );

    return results.reduce<CandidateRouteBatch>(
      (batch, result) => {
        if (result.status === "available") {
          batch.available.push(result.candidateRoute);
        } else {
          batch.failures.push(result.failure);
        }
        return batch;
      },
      { available: [], failures: [] },
    );
  }

  private async loadCandidate(
    candidate: RecommendationCandidate,
    origin: RoutePoint,
  ): Promise<CandidateRouteResult> {
    try {
      const route = await this.dependencies.routingProvider.getDrivingRoute({
        origin,
        destination: {
          latitude: candidate.latitude,
          longitude: candidate.longitude,
        },
      });

      return { status: "available", candidateRoute: { candidate, route } };
    } catch {
      return {
        status: "failed",
        failure: {
          candidateId: candidate.id,
          slug: candidate.slug,
          code: "ROUTE_UNAVAILABLE",
        },
      };
    }
  }
}
