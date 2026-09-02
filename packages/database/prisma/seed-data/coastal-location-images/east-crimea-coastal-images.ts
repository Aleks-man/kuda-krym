import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  beregovoeVillageImage,
  feodosiaBeachImage,
  koktebelBeachImage,
  novySvetBayImage,
  ordzhonikidzeCoastImage,
  primorskyVillageImage,
} from "../media/east-crimea-image-assets.js";

export const eastCrimeaCoastalImages = [
  cover("novy-svet", novySvetBayImage, "Бухта и побережье Нового Света"),
  cover("koktebel", koktebelBeachImage, "Пляж и побережье Коктебеля"),
  cover(
    "ordzhonikidze",
    ordzhonikidzeCoastImage,
    "Побережье Орджоникидзе",
  ),
  cover("feodosia", feodosiaBeachImage, "Пляж на побережье Феодосии"),
  cover(
    "beregovoe",
    beregovoeVillageImage,
    "Троицкая церковь в селе Береговое",
  ),
  cover(
    "primorsky",
    primorskyVillageImage,
    "Вид на посёлок Приморский со стороны шоссе Феодосия — Керчь",
  ),
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
