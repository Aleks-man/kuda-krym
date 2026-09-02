import type { SeedBeachImage } from "./beach-image.types.js";

export const eastCrimeaBeachImages = [
  {
    beachSlug: "sudak-central",
    localUrl: "/images/beaches/sudak-central-2011.webp",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%A6%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BF%D0%BB%D1%8F%D0%B6_%D0%A1%D1%83%D0%B4%D0%B0%D0%BA%D0%B0_2011.jpg?width=1280",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A6%D0%B5%D0%BD%D1%82%D1%80%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9_%D0%BF%D0%BB%D1%8F%D0%B6_%D0%A1%D1%83%D0%B4%D0%B0%D0%BA%D0%B0_2011.jpg",
    title: "Центральный пляж Судака 2011",
    author: "Insider",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    alt: "Центральный пляж Судака и береговая линия",
    sourceVerifiedAt: "2026-09-02",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
