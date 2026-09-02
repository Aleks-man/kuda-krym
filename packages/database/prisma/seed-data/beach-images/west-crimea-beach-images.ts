import type { SeedBeachImage } from "./beach-image.types.js";

export const westCrimeaBeachImages = [
  {
    beachSlug: "popovka",
    localUrl: "/images/beaches/popovka-sunset-2007.webp",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Kazantip%2C_Popovka%2C_Crimea%2C_Bronze_setting_sun%2C_Summer_on_the_beach.jpg?width=1280",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Kazantip%2C_Popovka%2C_Crimea%2C_Bronze_setting_sun%2C_Summer_on_the_beach.jpg",
    title: "Kazantip, Popovka, Crimea, Bronze setting sun",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    alt: "Закат над песчаным пляжем Поповки",
    sourceVerifiedAt: "2026-09-02",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
