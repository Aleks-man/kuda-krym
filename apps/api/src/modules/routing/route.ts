export type RoutePoint = Readonly<{
  latitude: number;
  longitude: number;
}>;

export type RouteRequest = Readonly<{
  origin: RoutePoint;
  destination: RoutePoint;
}>;

export type DrivingRoute = Readonly<{
  origin: RoutePoint;
  destination: RoutePoint;
  distanceMeters: number;
  durationSeconds: number;
  geometry: Readonly<{
    type: "LineString";
    coordinates: [number, number][];
  }>;
  source: "OSRM";
  calculatedAt: string;
}>;

export interface RoutingProvider {
  getDrivingRoute(request: RouteRequest): Promise<DrivingRoute>;
}
