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
  cover("ordzhonikidze", ordzhonikidzeCoastImage, "Побережье Орджоникидзе"),
  cover("feodosia", feodosiaBeachImage, "Набережная, пляж и порт Феодосии"),
  cover(
    "beregovoe",
    beregovoeVillageImage,
    "Золотой песчаный пляж у Берегового",
  ),
  cover(
    "primorsky",
    primorskyVillageImage,
    "Закат над Чёрным морем в Приморском",
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
  return { coastalLocationSlug, ...asset, alt, isCover: true, sortOrder: 0 };
}
