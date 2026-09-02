import type { LicensedImageAsset } from "./licensed-image.types.js";

export const forosCoastImage = image(
  "foros-sarych-coast-2005",
  "Sarych_(Crimea).jpg",
  "Мыс Сарыч и Ласпинская бухта возле Фороса",
  "Sergiy Klymenko",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const simeizCoastImage = image(
  "simeiz-boardwalk",
  "Simeiz_boardwalk.jpg",
  "Simeiz boardwalk",
  "Dasha Siromakha",
  "CC BY-SA 2.0",
  "https://creativecommons.org/licenses/by-sa/2.0/",
);

export const alupkaBeachImage = image(
  "alupka-beach-2013",
  "Alupka_-_beach.jpg",
  "Alupka - beach",
  "Tiia Monto",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const yaltaBeachImage = image(
  "yalta-beach-2016",
  "Busy_Yalta_beach_(Unsplash).jpg",
  "Busy Yalta beach",
  "Igor Ovsyannykov",
  "CC0 1.0",
  "https://creativecommons.org/publicdomain/zero/1.0/",
);

export const gurzufCoastImage = image(
  "gurzuf-coast-2023",
  "Crimea._Gurzuf_P9120767_2600.jpg",
  "Crimea. Gurzuf",
  "Alexxx1979",
  "CC0 1.0",
  "https://creativecommons.org/publicdomain/zero/1.0/",
);

export const partenitImage = image(
  "partenit-2009",
  "Partenit.jpg",
  "Partenit",
  "SilvioMartin",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
);

export const alushtaCoastImage = image(
  "alushta-coast",
  "Alushta%2C_Crimea%2C_Ukraine_-_panoramio.jpg",
  "Alushta, Crimea, Ukraine",
  "dc_ScAn",
  "CC BY 3.0",
  "https://creativecommons.org/licenses/by/3.0/",
);

export const rybachyeBeachImage = image(
  "rybachye-beach-2010",
  "Rybachie_Krym.JPG",
  "Rybachie Krym",
  "Дар Ветер",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
);

export const malorechenskoeImage = image(
  "malorechenskoe-2011",
  "Malorechenskoe_1.JPG",
  "Malorechenskoe village, Crimea",
  "В. С. Білецький",
  "CC0 1.0",
  "https://creativecommons.org/publicdomain/zero/1.0/",
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
