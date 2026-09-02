import type { SeedBeachImage } from "./beach-image.types.js";

export const sevastopolBeachImages = [
  {
    beachSlug: "yashmovyy",
    localUrl: "/images/beaches/yashmovyy-cape-fiolent.webp",
    downloadUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Beach_of_Cape_Fiolent%2C_Crimea.jpg/1280px-Beach_of_Cape_Fiolent%2C_Crimea.jpg",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Beach_of_Cape_Fiolent,_Crimea.jpg",
    title: "Beach of Cape Fiolent, Crimea",
    author: "Vyacheslav Argenberg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    alt: "Яшмовый пляж у мыса Фиолент во время волнения на море",
    sourceVerifiedAt: "2026-09-01",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
