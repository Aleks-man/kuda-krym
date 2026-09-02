import type { SeedBeachImage } from "./beach-image.types.js";
import { popovkaSunsetImage } from "../media/verified-image-assets.js";

export const westCrimeaBeachImages = [
  {
    beachSlug: "popovka",
    ...popovkaSunsetImage,
    alt: "Закат над песчаным пляжем Поповки",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
