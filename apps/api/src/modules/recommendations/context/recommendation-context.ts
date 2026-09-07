import type { ForecastDays } from "../../../shared/forecast/forecast-days.js";

export type RecommendationOrigin = Readonly<{
  code: string;
  name: string;
  latitude: number;
  longitude: number;
}>;

export type RecommendationContext = Readonly<{
  origin: RecommendationOrigin;
  date: string;
  forecastDays: ForecastDays;
  visitWindow: Readonly<{
    startsAt: string;
    endsAt: string;
  }>;
  company: "ALONE" | "WITH_CHILDREN" | "FRIENDS";
  preferredSurface: "ANY" | "SAND" | "PEBBLE";
  priority: "CALM_SEA" | "WARM_WATER" | "COMFORT";
  maxTravelMinutes: number;
}>;
