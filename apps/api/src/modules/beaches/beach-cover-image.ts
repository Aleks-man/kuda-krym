import type { BeachCoverImage, PlaceImage } from "@kuda-krym/contracts";

export function selectBeachCoverImage(
  beachImages: readonly PlaceImage[],
  coastalLocationImages: readonly PlaceImage[],
): BeachCoverImage | null {
  const beachImage = beachImages[0];
  if (beachImage) return { ...beachImage, context: "BEACH" };

  const coastalImage = coastalLocationImages[0];
  if (coastalImage) {
    return { ...coastalImage, context: "COASTAL_LOCATION" };
  }

  return null;
}
