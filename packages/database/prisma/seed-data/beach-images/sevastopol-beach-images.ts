import type { SeedBeachImage } from "./beach-image.types.js";
import {
  uchkuevkaImage,
  yashmovyyFiolentImage,
} from "../media/verified-image-assets.js";

export const sevastopolBeachImages = [
  {
    beachSlug: "uchkuevka",
    ...uchkuevkaImage,
    alt: "Пляж Учкуевки в июне",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "yashmovyy",
    ...yashmovyyFiolentImage,
    alt: "Яшмовый пляж у мыса Фиолент во время волнения на море",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
