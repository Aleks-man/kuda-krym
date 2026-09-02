import type { SeedBeachImage } from "./beach-image.types.js";

export const kerchPeninsulaBeachImages = [
  {
    beachSlug: "shchelkino-beach",
    localUrl: "/images/beaches/shchelkino-beach-2015.webp",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%A9%D0%BE%D0%BB%D0%BA%D1%96%D0%BD%D0%B5_%D0%BF%D0%BB%D1%8F%D0%B6.jpg?width=1280",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%A9%D0%BE%D0%BB%D0%BA%D1%96%D0%BD%D0%B5_%D0%BF%D0%BB%D1%8F%D0%B6.jpg",
    title: "Щолкіне пляж",
    author: "EvgenyChe",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    alt: "Песчаный пляж Щёлкино на берегу Азовского моря",
    sourceVerifiedAt: "2026-09-02",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
