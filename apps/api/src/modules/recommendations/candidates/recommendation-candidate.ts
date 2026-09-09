import type { PlaceImage } from "@kuda-krym/contracts";

export type RecommendationCandidate = Readonly<{
  id: string;
  slug: string;
  name: string;
  coastalLocation?: Readonly<{
    slug: string;
    name: string;
    coverImage: PlaceImage | null;
  }> | null;
  latitude: number;
  longitude: number;
  surface: "UNKNOWN" | "SAND" | "PEBBLE" | "MIXED" | "ROCK";
  childSuitability: "UNKNOWN" | "SUITABLE" | "LIMITED" | "UNSUITABLE";
}>;
