import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  chernomorskoeBeachImage,
  evpatoriaBeachImage,
  nikolaevkaBeachImage,
  novofedorovkaBeachImage,
  olenevkaBeachImage,
  popovkaSunsetImage,
} from "../media/verified-image-assets.js";

export const westCrimeaCoastalImages = [
  cover(
    "chernomorskoe",
    chernomorskoeBeachImage,
    "Пляж и побережье Черноморского",
  ),
  cover("olenevka", olenevkaBeachImage, "Песчаное побережье Оленевки"),
  cover("evpatoria", evpatoriaBeachImage, "Побережье Евпатории"),
  cover("popovka", popovkaSunsetImage, "Закат над побережьем Поповки"),
  cover(
    "novofedorovka",
    novofedorovkaBeachImage,
    "Пляж и побережье Новофёдоровки",
  ),
  cover("nikolaevka", nikolaevkaBeachImage, "Побережье Николаевки"),
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
