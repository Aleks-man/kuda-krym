import type { LicensedImageAsset } from "./licensed-image.types.js";

export const novySvetBayImage = image(
  "novy-svet-bay-2011",
  "Novy_Svet%2C_Crimea%2C_Bay_of_Novy_Svet.jpg",
  "Novy Svet, Crimea, Bay of Novy Svet",
  "Vyacheslav Argenberg",
  "CC BY 4.0",
  "https://creativecommons.org/licenses/by/4.0/",
);

export const koktebelBeachImage = image(
  "koktebel-beach-2013",
  "Koktebel_-_beach.jpg",
  "Koktebel - beach",
  "Tiia Monto",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const ordzhonikidzeCoastImage = image(
  "ordzhonikidze-coast-2015",
  "2015._%D0%9E%D1%80%D0%B4%D0%B6%D0%BE%D0%BD%D0%B8%D0%BA%D0%B8%D0%B4%D0%B7%D0%B5_019.jpg",
  "2015. Орджоникидзе 019",
  "Andrew Butko",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const feodosiaBeachImage = image(
  "feodosia-beach-2019",
  "Black_Sea%2C_Feodosia_Beach%2C_Crimea.jpg",
  "Black Sea, Feodosia Beach, Crimea",
  "Lusyanya",
  "CC BY 4.0",
  "https://creativecommons.org/licenses/by/4.0/",
);

export const beregovoeVillageImage = image(
  "beregovoe-village-2015",
  "Church_BeregovoeFeo_1.jpg",
  "Троицкая церковь в селе Береговое",
  "FrostDre",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const primorskyVillageImage = image(
  "primorsky-village-2008",
  "%D0%9A%D1%80%D1%8B%D0%BC_%D0%9F%D1%80%D0%B8%D0%BC%D0%BE%D1%80%D1%81%D0%BA%D0%B8%D0%B9_%D0%9F%D1%8F%D1%82%D0%B8%D1%8D%D1%82%D0%B0%D0%B6%D0%BA%D0%B8.jpg",
  "Вид на посёлок Приморский",
  "Водник",
  "Public domain",
  null,
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
