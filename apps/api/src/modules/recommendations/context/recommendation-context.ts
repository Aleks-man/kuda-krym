export type RecommendationOrigin = Readonly<{
  code: string;
  name: string;
  latitude: number;
  longitude: number;
}>;

export type RecommendationContext = Readonly<{
  origin: RecommendationOrigin;
  date: string;
  forecastDays: 1 | 2;
  visitWindow: Readonly<{
    startsAt: string;
    endsAt: string;
  }>;
  company: "ALONE" | "WITH_CHILDREN" | "FRIENDS";
  preferredSurface: "ANY" | "SAND" | "PEBBLE";
  priority: "CALM_SEA" | "WARM_WATER" | "COMFORT";
  maxTravelMinutes: number;
}>;
