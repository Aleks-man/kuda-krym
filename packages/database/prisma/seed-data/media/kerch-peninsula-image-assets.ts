import type { LicensedImageAsset } from "./licensed-image.types.js";

export const yakovenkovoOpukImage = image(
  "yakovenkovo-opuk-coast-2007",
  "Opuk.jpg",
  "Opuk nature reserve and Black Sea coast",
  "Robert Niedźwiedzki",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const geroevskoeMemorialImage = image(
  "geroevskoe-sail-memorial-2021",
  "%D0%9C%D0%BE%D0%BD%D1%83%D0%BC%D0%B5%D0%BD%D1%82_%D0%9F%D0%B0%D1%80%D1%83%D1%81_%D0%B2_%D0%9A%D1%80%D1%8B%D0%BC%D1%83_%D0%BD%D0%B0_%D0%BC%D0%B5%D1%81%D1%82%D0%B5_%D0%BF%D1%80%D0%BE%D0%B2%D0%B5%D0%B4%D0%B5%D0%BD%D0%B8%D1%8F_%D0%9A%D0%B5%D1%80%D1%87%D0%B5%D0%BD%D1%81%D0%BA%D0%BE-%D0%AD%D0%BB%D1%8C%D1%82%D0%B8%D0%B3%D0%B5%D0%BD%D1%81%D0%BA%D0%BE%D0%B9_%D0%B4%D0%B5%D1%81%D0%B0%D0%BD%D1%82%D0%BD%D0%BE%D0%B9_%D0%BE%D0%BF%D0%B5%D1%80%D0%B0%D1%86%D0%B8%D0%B8.jpg",
  "Монумент Парус в Героевском",
  "JukoFF",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

export const kerchStraitImage = image(
  "kerch-strait-morning-2005",
  "Early_morning_on_Kerch_strait_-_Crimea%2C_Ukraine_-_panoramio.jpg",
  "Early morning on Kerch Strait",
  "Sergey Ashmarin",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const kurortnoeChokrakImage = image(
  "kurortnoe-chokrak-2008",
  "Chokrak.jpg",
  "Chokrak lake and the Sea of Azov",
  "Kurgus",
  "Public domain",
  null,
);

export const zolotoeKaralarCoastImage = image(
  "zolotoe-karalar-coast-2018",
  "%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%BF%D0%BB%D1%8F%D0%B6_%D0%B8_%D1%81%D0%BA%D0%B0%D0%BB%D1%8B_%D0%9A%D0%B0%D1%80%D0%B0%D0%BB%D0%B0%D1%80%D1%81%D0%BA%D0%BE%D0%B3%D0%BE_%D0%B7%D0%B0%D0%BF%D0%BE%D0%B2%D0%B5%D0%B4%D0%BD%D0%B8%D0%BA%D0%B0.jpg",
  "Пляж и скалы Караларского природного парка",
  "Булгакова Наталья",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

function image(
  localName: string,
  commonsFileName: string,
  title: string,
  author: string,
  license: LicensedImageAsset["license"],
  licenseUrl: LicensedImageAsset["licenseUrl"],
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
