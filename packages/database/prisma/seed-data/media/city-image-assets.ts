import type { LicensedImageAsset } from "./licensed-image.types.js";

export const simferopolHistoricCenterImage = {
  localUrl: "/images/places/simferopol-historic-center.webp",
  downloadUrl:
    "https://commons.wikimedia.org/wiki/Special:Redirect/file/Simferopol_panorama2.jpg?width=1600",
  sourceUrl:
    "https://commons.wikimedia.org/wiki/File:Simferopol_panorama2.jpg",
  title: "Исторический центр Симферополя",
  author: "Tiia Monto",
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
  sourceVerifiedAt: "2026-09-08",
} as const satisfies LicensedImageAsset;

export const cityImageAssets = [simferopolHistoricCenterImage] as const;
