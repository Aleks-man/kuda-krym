import type { PlaceImage } from "@kuda-krym/contracts";

// Wikimedia Commons photographs resized and converted to WebP.
// Each derivative retains the source license and author attribution.
export const cityCoverImages: Readonly<Record<string, PlaceImage>> = {
  "bakhchisaray": {
    "url": "/images/places/bakhchisaray-khan-palace.webp",
    "alt": "Двор Ханского дворца с цветниками и минаретом в Бахчисарае",
    "title": "Ханский дворец в Бахчисарае",
    "author": "Aleksander Kaasik",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:Baht%C5%A1isarai-Khaani_palee_Krimmis.jpg"
  },
  "belogorsk": {
    "url": "/images/places/belogorsk-lunacharskogo.webp",
    "alt": "Пешеходная улица Луначарского в Белогорске",
    "title": "Улица Луначарского в Белогорске",
    "author": "Юровский Александр",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%D0%9F%D0%B0%D0%BC'%D1%8F%D1%82%D0%BD%D0%B8%D0%BA_%D0%A1%D1%83%D0%B2%D0%BE%D1%80%D0%BE%D0%B2%D1%83_%D0%BD%D0%B0_%D0%B2%D1%83%D0%BB%D0%B8%D1%86%D1%96_%D0%9B%D1%83%D0%BD%D0%B0%D1%87%D0%B0%D1%80%D1%81%D1%8C%D0%BA%D0%BE%D0%B3%D0%BE%2C_%D0%91%D1%96%D0%BB%D0%BE%D0%B3%D1%96%D1%80%D1%81%D1%8C%D0%BA.JPG"
  },
  "dzhankoy": {
    "url": "/images/places/dzhankoy-evening.webp",
    "alt": "Вечерний вид Джанкоя с освещённым храмом и городскими огнями",
    "title": "Вечерний Джанкой",
    "author": "VD2310 (Виктор Димитров)",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "sourceUrl": "https://commons.wikimedia.org/wiki/File:%D0%9D%D0%BE%D1%87%D0%BD%D0%BE%D0%B9_%D0%B4%D0%B6%D0%B0%D0%BD%D0%BA%D0%BE%D0%B9.jpg"
  }
};
