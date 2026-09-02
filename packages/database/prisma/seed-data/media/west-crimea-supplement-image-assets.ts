import type { LicensedImageAsset } from "./licensed-image.types.js";

export const mezhvodnoeSunsetImage = image(
  "mezhvodnoe-sunset-2008",
  "%D0%97%D0%B0%D0%BA%D0%B0%D1%82_%D0%BD%D0%B0%D0%B4_%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%BC_%D0%BC%D0%BE%D1%80%D0%B5%D0%BC%2C_%D0%9C%D0%B5%D0%B6%D0%B2%D0%BE%D0%B4%D0%BD%D0%BE%D0%B5%2C_%D0%A7%D0%B5%D1%80%D0%BD%D0%BE%D0%BC%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D0%B9_%D1%80%D0%B0%D0%B9%D0%BE%D0%BD%2C_%D0%9A%D1%80%D1%8B%D0%BC%2C_%D0%A3%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%B0%2C_2008.jpg",
  "Закат над Чёрным морем, Межводное, 2008",
  "Majuro",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const steregushcheeCoastImage = image(
  "steregushchee-bakalskaya-spit-2020",
  "%D0%91%D0%B0%D0%BA%D0%B0%D0%BB%D1%8C%D1%81%D0%BA%D0%B0%D1%8F_%D0%BA%D0%BE%D1%81%D0%B0.jpg",
  "Бакальская коса",
  "Ted.ns",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

export const zaozernoeSunsetImage = image(
  "zaozernoe-sunset-2010",
  "%D0%97%D0%B0%D0%BA%D0%B0%D1%82_%D0%BD%D0%B0%D0%B4_%D0%A7%D1%91%D1%80%D0%BD%D1%8B%D0%BC_%D0%BC%D0%BE%D1%80%D0%B5%D0%BC_%D1%83_%D0%97%D0%B0%D0%BE%D0%B7%D0%B5%D1%80%D0%BD%D0%BE%D0%B3%D0%BE.jpg",
  "Закат над Чёрным морем у Заозёрного",
  "Insider",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
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
