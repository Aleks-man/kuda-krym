import type { SeedBeachImage } from "./beach-image.types.js";
import {
  generalskieBeachesImage,
  marineInfantryCoastImage,
  rigaBeachImage,
} from "../media/kerch-beach-image-assets.js";
import { shchelkinoBeachImage } from "../media/verified-image-assets.js";

export const kerchPeninsulaBeachImages = [
  {
    beachSlug: "shchelkino-beach",
    ...shchelkinoBeachImage,
    alt: "Песчаный пляж Щёлкино на берегу Азовского моря",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "riga-beach",
    ...rigaBeachImage,
    alt: "Пляж Рига на побережье Щёлкино",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "generalskie-beaches",
    ...generalskieBeachesImage,
    alt: "Песчаная бухта Генеральских пляжей на закате",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "marine-infantry-beach",
    ...marineInfantryCoastImage,
    alt: "Скалистое побережье Азовского моря у Курортного",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
