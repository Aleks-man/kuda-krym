import type { RoutePoint } from "@kuda-krym/contracts";
import type { DrivingRoute, RoutingProvider } from "./route.js";
import type { RoutingBeachRepository } from "./routing-beach.repository.js";

type RoutingServiceDependencies = Readonly<{
  beachRepository: RoutingBeachRepository;
  routingProvider: RoutingProvider;
}>;

export class RoutingService {
  public constructor(private readonly dependencies: RoutingServiceDependencies) {}

  public async calculateDrivingRoute(
    origin: RoutePoint,
    beachId: string,
  ): Promise<DrivingRoute | null> {
    const beach = await this.dependencies.beachRepository.findPublishedById(
      beachId,
    );

    if (!beach) return null;

    return this.dependencies.routingProvider.getDrivingRoute({
      origin,
      destination: {
        latitude: beach.latitude,
        longitude: beach.longitude,
      },
    });
  }
}
