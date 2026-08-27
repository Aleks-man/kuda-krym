type RoutePoint = Readonly<{ latitude: number; longitude: number }>;

export type RouteCacheKey = `route:driving:${string}:${string}`;

const coordinatePrecision = 5;

export function createRouteCacheKey(
  origin: RoutePoint,
  destination: RoutePoint,
): RouteCacheKey {
  return `route:driving:${formatPoint(origin)}:${formatPoint(destination)}`;
}

function formatPoint(point: RoutePoint): string {
  return [point.latitude, point.longitude]
    .map((coordinate) => coordinate.toFixed(coordinatePrecision))
    .join(",");
}
