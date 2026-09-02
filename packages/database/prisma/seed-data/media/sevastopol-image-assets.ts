import type { LicensedImageAsset } from "./licensed-image.types.js";

export const kachaCoastImage = image(
  "kacha-coast-2010",
  "Kacha_Krym.JPG",
  "Kacha Krym",
  "Дар Ветер",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const balaklavaBayImage = image(
  "balaklava-bay-2006",
  "Balaklava_Bay%2C_Crimea.jpg",
  "Balaklava Bay, Crimea",
  "Vyacheslav Argenberg",
  "CC BY 4.0",
  "https://creativecommons.org/licenses/by/4.0/",
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
    sourceVerifiedAt: "2026-09-02",
  };
}
