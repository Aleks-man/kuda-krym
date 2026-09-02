import type { SeedBeachImage } from "./beach-image.types.js";
import { sudakCentralImage } from "../media/verified-image-assets.js";

export const eastCrimeaBeachImages = [
  {
    beachSlug: "sudak-central",
    ...sudakCentralImage,
    alt: "Центральный пляж Судака и береговая линия",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
