import type {
  LicensedImageAsset,
  SeedImagePlacement,
} from "../media/licensed-image.types.js";

export type SeedCoastalLocationImage = LicensedImageAsset &
  SeedImagePlacement &
  Readonly<{
    coastalLocationSlug: string;
  }>;
