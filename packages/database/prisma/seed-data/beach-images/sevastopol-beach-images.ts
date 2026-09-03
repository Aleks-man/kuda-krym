import type { SeedBeachImage } from "./beach-image.types.js";
import {
  khrustalnyBeachImage,
  omegaBeachImage,
  victoryParkBeachImage,
} from "../media/sevastopol-beach-image-assets.js";
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
  {
    beachSlug: "sevastopol-khrustalny-beach",
    ...khrustalnyBeachImage,
    alt: "Хрустальный пляж на берегу Севастопольской бухты",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "sevastopol-victory-park-beach",
    ...victoryParkBeachImage,
    alt: "Пляж Парка Победы и морская набережная Севастополя",
    isCover: true,
    sortOrder: 0,
  },
  {
    beachSlug: "omega",
    ...omegaBeachImage,
    alt: "Пляж Омега на берегу Круглой бухты",
    isCover: true,
    sortOrder: 0,
  },
] as const satisfies readonly SeedBeachImage[];
