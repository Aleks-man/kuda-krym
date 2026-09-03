import type { SeedCoastalLocationImage } from "./coastal-location-image.types.js";
import {
  alupkaBeachImage,
  alushtaCoastImage,
  forosCoastImage,
  gurzufCoastImage,
  malorechenskoeImage,
  partenitImage,
  rybachyeBeachImage,
  simeizCoastImage,
  yaltaBeachImage,
} from "../media/south-coast-image-assets.js";

export const southCoastCoastalImages = [
  cover("foros", forosCoastImage, "Мыс Сарыч и побережье возле Фороса"),
  cover("simeiz", simeizCoastImage, "Пляж и причал Симеиза у скалы Дива"),
  cover("alupka", alupkaBeachImage, "Галечное побережье Алупки"),
  cover("yalta", yaltaBeachImage, "Пляж на побережье Ялты"),
  cover("gurzuf", gurzufCoastImage, "Пляж Гурзуфа, море и скалы Адалары"),
  cover("partenit", partenitImage, "Галечный пляж Партенита у моря"),
  cover("alushta", alushtaCoastImage, "Побережье Алушты"),
  cover(
    "malorechenskoe",
    malorechenskoeImage,
    "Малореченское и окружающее побережье",
  ),
  cover("rybachye", rybachyeBeachImage, "Пляж и побережье Рыбачьего"),
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
