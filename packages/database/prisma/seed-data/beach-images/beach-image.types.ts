import type {
  LicensedImageAsset,
  SeedImagePlacement,
} from "../media/licensed-image.types.js";

export type SeedBeachImage = LicensedImageAsset &
  SeedImagePlacement &
  Readonly<{
  beachSlug: string;
  }>;
