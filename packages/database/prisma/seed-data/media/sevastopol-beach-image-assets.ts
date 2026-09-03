import type { LicensedImageAsset } from "./licensed-image.types.js";

export const khrustalnyBeachImage = image(
  "sevastopol-khrustalny-beach",
  "%D0%9F%D0%BB%D1%8F%D0%B6_%D0%A5%D1%80%D1%83%D1%81%D1%82%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C.jpg",
  "Пляж Хрустальный, Севастополь",
  "Водник",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const victoryParkBeachImage = image(
  "sevastopol-victory-park-beach-2015",
  "%D0%9F%D0%BB%D1%8F%D0%B6_%D0%B2_%D0%BF%D0%B0%D1%80%D0%BA%D1%83_%D0%9F%D0%B5%D1%80%D0%B5%D0%BC%D0%BE%D0%B3%D0%B8%2C_%D0%A1%D0%B5%D0%B2%D0%B0%D1%81%D1%82%D0%BE%D0%BF%D0%BE%D0%BB%D1%8C.JPG",
  "Пляж в Парке Победы, Севастополь",
  "Юровский Александр",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

export const omegaBeachImage = image(
  "sevastopol-omega-beach-2011",
  "%D0%9F%D0%BB%D1%8F%D0%B6_%C2%AB%D0%9E%D0%BC%D0%B5%D0%B3%D0%B0%C2%BB.jpg",
  "Пляж «Омега»",
  "Kamelot",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
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
