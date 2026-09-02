import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  popovkaSunsetImage,
  shchelkinoBeachImage,
  sudakCentralImage,
  uchkuevkaImage,
  yashmovyyFiolentImage,
} from "../media/verified-image-assets.js";

export const initialCoastalLocationImages = [
  cover("popovka", popovkaSunsetImage, "Закат над побережьем Поповки"),
  cover("sudak", sudakCentralImage, "Побережье и городской пляж Судака"),
  cover("sevastopol-north", uchkuevkaImage, "Побережье Учкуевки на севере Севастополя"),
  cover("fiolent", yashmovyyFiolentImage, "Скалистое побережье мыса Фиолент"),
  cover("shchelkino", shchelkinoBeachImage, "Побережье Щёлкино на Азовском море"),
] as const satisfies readonly SeedCoastalLocationImage[];

function cover(
  coastalLocationSlug: string,
  asset: Omit<SeedCoastalLocationImage, "coastalLocationSlug" | "alt" | "isCover" | "sortOrder">,
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
