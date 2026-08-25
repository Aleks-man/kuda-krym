import type { RouteResponse } from "@kuda-krym/contracts";
import type { DrivingRoute } from "./route.js";

export function mapRouteResponse(route: DrivingRoute): RouteResponse {
  return {
    data: {
      origin: route.origin,
      destination: route.destination,
      distanceMeters: route.distanceMeters,
      durationSeconds: route.durationSeconds,
      geometry: route.geometry,
    },
    meta: {
      source: route.source,
      calculatedAt: route.calculatedAt,
      cached: false,
    },
  };
}
