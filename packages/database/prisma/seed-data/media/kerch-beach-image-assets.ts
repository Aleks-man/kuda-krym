import type { LicensedImageAsset } from "./licensed-image.types.js";

export const rigaBeachImage = image(
  "shchelkino-riga-beach",
  "Shcholkine_beach3.jpg",
  "Shcholkine beach",
  "Tiia Monto",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const generalskieBeachesImage = image(
  "generalskie-beaches-sunset-2020",
  "%D0%9A%D0%B0%D1%80%D0%B0%D0%BB%D0%B0%D1%80%D1%81%D0%BA%D0%B8%D0%B9_%D0%B7%D0%B0%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA%2C_%D0%93%D0%B5%D0%BD%D0%B5%D1%80%D0%B0%D0%BB%D1%8C%D1%81%D0%BA%D0%B8%D0%B5_%D0%BF%D0%BB%D1%8F%D0%B6%D0%B8%2C_%D0%B2%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%BE%D0%B4%D0%BD%D1%83_%D0%B8%D0%B7_%D0%B1%D1%83%D1%85%D1%82-%D0%B7%D0%B0%D1%85%D0%BE%D0%B4_%D1%81%D0%BE%D0%BB%D0%BD%D1%86%D0%B0.jpg",
  "Бухта Генеральских пляжей на закате",
  "YaDasha",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

export const marineInfantryCoastImage = image(
  "marine-infantry-zyuk-coast",
  "Cape.Zyuk-3.jpg",
  "Побережье мыса Зюк у Курортного",
  "Kurgus",
  "CC0 1.0",
  "https://creativecommons.org/publicdomain/zero/1.0/",
);

function image(
  localName: string,
  commonsFileName: string,
  title: string,
  author: string,
  license: LicensedImageAsset["license"],
  licenseUrl: NonNullable<LicensedImageAsset["licenseUrl"]>,
): LicensedImageAsset {
  return {
    localUrl: `/images/places/${localName}.webp`,
    downloadUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${commonsFileName}?width=1280`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${commonsFileName}`,
    title,
    author,
    license,
    licenseUrl,
    sourceVerifiedAt: "2026-09-03",
  };
}
