import type { SeedBeachImage } from "./beach-image.types.js";
import {
  foxBaySunsetImage,
  quietBayCapeImage,
} from "../media/east-crimea-beach-image-assets.js";
import { sudakCentralImage } from "../media/verified-image-assets.js";

export const eastCrimeaBeachImages = [
  {
    beachSlug: "sudak-central",
    ...sudakCentralImage,
    alt: "Центральный пляж Судака и береговая линия",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "fox-bay-beach",
    ...foxBaySunsetImage,
    alt: "Закат над морем и вулканическим берегом Лисьей бухты",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "koktebel-tikhaya-bay-beach",
    ...quietBayCapeImage,
    alt: "Пляж Тихой бухты, прибой и мыс Хамелеон",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
