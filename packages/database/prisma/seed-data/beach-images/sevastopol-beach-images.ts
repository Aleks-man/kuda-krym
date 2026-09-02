import type { SeedBeachImage } from "./beach-image.types.js";

export const sevastopolBeachImages = [
  {
    beachSlug: "uchkuevka",
    localUrl: "/images/beaches/uchkuevka-june-2022.webp",
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/%D0%9F%D0%BB%D1%8F%D0%B6_%D0%B2_%D0%A3%D1%87%D0%BA%D1%83%D0%B5%D0%B2%D0%BA%D0%B5%2C_%D0%B8%D1%8E%D0%BD%D1%8C_2022%2C_03.jpg?width=1280",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%BB%D1%8F%D0%B6_%D0%B2_%D0%A3%D1%87%D0%BA%D1%83%D0%B5%D0%B2%D0%BA%D0%B5%2C_%D0%B8%D1%8E%D0%BD%D1%8C_2022%2C_03.jpg",
    title: "Пляж в Учкуевке, июнь 2022, 03",
    author: "Mitte27",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    alt: "Пляж Учкуевки в июне",
    sourceVerifiedAt: "2026-09-02",
    isCover: true,
    sortOrder: 0,
  },
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
