import type { LicensedImageAsset } from "./licensed-image.types.js";

export const kachaCoastImage = image(
  "kacha-beach",
  "Пляж_в_Каче_-_panoramio.jpg",
  "Пляж в Каче",
  "Алексей Решетников",
  "CC BY 3.0",
  "https://creativecommons.org/licenses/by/3.0/",
  "2026-09-03",
);

export const balaklavaBayImage = image(
  "balaklava-bay-2006",
  "Balaklava_Bay%2C_Crimea.jpg",
  "Balaklava Bay, Crimea",
  "Vyacheslav Argenberg",
  "CC BY 4.0",
  "https://creativecommons.org/licenses/by/4.0/",
);

export const sevastopolBlueBayImage = image(
  "sevastopol-blue-bay-2010",
  "Sevastopol%2C_the_Blue_bay_-_%D0%9A%D0%B0%D0%B7%D0%B0%D1%87%D0%BA%D0%B0%2C_%D0%93%D0%BE%D0%BB%D1%83%D0%B1%D0%B0%D1%8F_%D0%B1%D1%83%D1%85%D1%82%D0%B0_-_panoramio.jpg",
  "Sevastopol, the Blue bay",
  "Pavlo68",
  "CC BY 3.0",
  "https://creativecommons.org/licenses/by/3.0/",
);

function image(
  localName: string,
  commonsFileName: string,
  title: string,
  author: string,
  license: LicensedImageAsset["license"],
  licenseUrl: NonNullable<LicensedImageAsset["licenseUrl"]>,
  sourceVerifiedAt = "2026-09-02",
): LicensedImageAsset {
  return {
    localUrl: `/images/places/${localName}.webp`,
    downloadUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${commonsFileName}?width=1280`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${commonsFileName}`,
    title,
    author,
    license,
    licenseUrl,
    sourceVerifiedAt,
  };
}
