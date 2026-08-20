export type ForecastBeach = Readonly<{
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
}>;

export interface ForecastBeachRepository {
  findPublishedById(id: string): Promise<ForecastBeach | null>;
}
