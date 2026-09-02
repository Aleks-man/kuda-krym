import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  balaklavaBayImage,
  kachaCoastImage,
} from "../media/sevastopol-image-assets.js";

export const sevastopolCoastalImages = [
  cover("kacha", kachaCoastImage, "Посёлок и побережье Качи"),
  cover("balaklava", balaklavaBayImage, "Балаклавская бухта и побережье"),
] as const satisfies readonly SeedCoastalLocationImage[];

function cover(
  coastalLocationSlug: string,
  asset: Omit<
    SeedCoastalLocationImage,
    "coastalLocationSlug" | "alt" | "isCover" | "sortOrder"
  >,
  alt: string,
): SeedCoastalLocationImage {
  return {
    coastalLocationSlug,
    ...asset,
    alt,
    isCover: true,
    sortOrder: 0,
  };
}
