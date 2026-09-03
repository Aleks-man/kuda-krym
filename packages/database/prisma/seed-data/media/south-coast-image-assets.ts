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
  "simeiz-diva-beach-2012",
  "%D0%92%D0%B8%D0%B4_%D0%BD%D0%B0_%D0%BF%D0%BB%D1%8F%D0%B6_%D0%B8_%D0%BF%D1%80%D0%B8%D1%87%D0%B0%D0%BB_%D1%81%D0%BE_%D1%81%D0%BA%D0%B0%D0%BB%D1%8B_%D0%94%D0%B8%D0%B2%D0%B0._%D0%A1%D0%B8%D0%BC%D0%B5%D0%B8%D0%B7._%D0%9A%D1%80%D1%8B%D0%BC._%D0%A1%D0%B5%D0%BD%D1%82%D1%8F%D0%B1%D1%80%D1%8C_2012_-_panoramio.jpg",
  "Вид на пляж и причал со скалы Дива в Симеизе",
  "Vadim Indeikin",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
  "2026-09-03",
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
  "gurzuf-beach-2021",
  "%D0%93%D1%83%D1%80%D0%B7%D1%83%D1%84%2C_%D0%BF%D0%BB%D1%8F%D0%B6.jpg",
  "Гурзуф, пляж",
  "Legioner2016",
  "CC BY-SA 4.0",
  "https://creativecommons.org/licenses/by-sa/4.0/",
  "2026-09-03",
);
export const partenitImage = image(
  "partenit-second-beach",
  "%D0%92%D1%82%D0%BE%D1%80%D0%BE%D0%B9_%D0%BF%D0%BB%D1%8F%D0%B6_%D0%9F%D0%B0%D1%80%D1%82%D0%B5%D0%BD%D0%B8%D1%82%D0%B0_-_panoramio.jpg",
  "Второй пляж Партенита",
  "geka_b",
  "CC BY-SA 3.0",
  "https://creativecommons.org/licenses/by-sa/3.0/",
  "2026-09-03",
);
export const alushtaCoastImage = image(
  "alushta-beach-coast-2009",
  "%D0%9F%D0%BE%D0%B1%D0%B5%D1%80%D0%B5%D0%B6%D1%8C%D0%B5_%D0%90%D0%BB%D1%83%D1%88%D1%82%D1%8B_-_panoramio.jpg",
  "Побережье Алушты",
  "viaman",
  "CC BY 3.0",
  "https://creativecommons.org/licenses/by/3.0/",
  "2026-09-03",
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
  sourceVerifiedAt = "2026-09-02",
): LicensedImageAsset {
  return {
    localUrl: `/images/places/${localName}.webp`,
    downloadUrl: `https://commons.wikimedia.org/wiki/Special:Redirect/file/${commonsFileName}?width=1280`,
    sourceUrl: `https://commons.wikimedia.org/wiki/File:${commonsFileName}`,
    title,
    author,
    license,
    licenseUrl,
    sourceVerifiedAt,
  };
}
