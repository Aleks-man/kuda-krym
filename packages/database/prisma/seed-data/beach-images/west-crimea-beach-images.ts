import type { SeedBeachImage } from "./beach-image.types.js";
import {
  evpatoriaGoldenBeachImage,
  popovkaSunsetImage,
} from "../media/verified-image-assets.js";

import { mezhvodnoeYarylgachBayImage } from "../media/west-crimea-supplement-image-assets.js";

export const westCrimeaBeachImages = [
  {
    beachSlug: "mezhvodnoe-city-beach",
    ...mezhvodnoeYarylgachBayImage,
    alt: "Песчаный берег Ярылгачской бухты у Межводного",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "popovka",
    ...popovkaSunsetImage,
    alt: "Закат над песчаным пляжем Поповки",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "evpatoria-azure-coast-beach",
    ...evpatoriaGoldenBeachImage,
    alt: "Песчаный пляж на побережье Евпатории",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
