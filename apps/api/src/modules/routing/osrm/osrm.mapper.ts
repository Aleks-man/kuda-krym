import type { DrivingRoute, RouteRequest } from "../route.js";
import type { OsrmResponse } from "./osrm-response.schema.js";

export function mapOsrmResponse(
  payload: OsrmResponse,
  request: RouteRequest,
  calculatedAt: string,
): DrivingRoute {
  const route = payload.routes[0];

  if (payload.code !== "Ok" || !route) {
    throw new Error(`OSRM could not build a route: ${payload.code}`);
  }

  return {
    origin: request.origin,
    destination: request.destination,
    distanceMeters: Math.round(route.distance),
    durationSeconds: Math.round(route.duration),
    geometry: route.geometry,
    source: "OSRM",
    calculatedAt,
  };
}
