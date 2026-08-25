export type RoutingBeach = Readonly<{
  id: string;
  latitude: number;
  longitude: number;
}>;

export interface RoutingBeachRepository {
  findPublishedById(id: string): Promise<RoutingBeach | null>;
}
