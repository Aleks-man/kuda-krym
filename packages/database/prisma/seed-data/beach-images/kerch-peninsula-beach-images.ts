import type { SeedBeachImage } from "./beach-image.types.js";
import { shchelkinoBeachImage } from "../media/verified-image-assets.js";

export const kerchPeninsulaBeachImages = [
  {
    beachSlug: "shchelkino-beach",
    ...shchelkinoBeachImage,
    alt: "Песчаный пляж Щёлкино на берегу Азовского моря",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
