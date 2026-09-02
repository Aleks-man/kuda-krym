import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  geroevskoeMemorialImage,
  kerchStraitImage,
  kurortnoeChokrakImage,
  yakovenkovoOpukImage,
  zolotoeKaralarCoastImage,
} from "../media/kerch-peninsula-image-assets.js";

export const kerchPeninsulaCoastalImages = [
  cover("yakovenkovo", yakovenkovoOpukImage, "Опукское побережье у Яковенкова"),
  cover(
    "geroevskoe",
    geroevskoeMemorialImage,
    "Монумент Парус на побережье Героевского",
  ),
  cover("kerch-strait", kerchStraitImage, "Керченский пролив ранним утром"),
  cover(
    "kurortnoe",
    kurortnoeChokrakImage,
    "Озеро Чокрак и пересыпь у Азовского моря",
  ),
  cover(
    "zolotoe",
    zolotoeKaralarCoastImage,
    "Пляж и скалы Караларского побережья у Золотого",
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
