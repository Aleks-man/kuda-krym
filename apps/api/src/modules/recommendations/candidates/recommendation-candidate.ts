export type RecommendationCandidate = Readonly<{
  id: string;
  slug: string;
  name: string;
  latitude: number;
  longitude: number;
  surface: "UNKNOWN" | "SAND" | "PEBBLE" | "MIXED" | "ROCK";
  childSuitability: "UNKNOWN" | "SUITABLE" | "LIMITED" | "UNSUITABLE";
}>;
