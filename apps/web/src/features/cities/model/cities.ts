import { inlandForecastLocations, type InlandForecastLocation, type PlaceImage } from "@kuda-krym/contracts";
import { cityCoverImages } from "./city-images";

export const simferopol = {
  slug: "simferopol",
  name: "Симферополь",
  coordinates: { latitude: 44.952117, longitude: 34.102417 },
  coverImage: {
    url: "/images/places/simferopol-historic-center.webp",
    alt: "Исторический центр Симферополя и городская пешеходная улица",
    title: "Исторический центр Симферополя",
    author: "Tiia Monto",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Simferopol_panorama2.jpg",
  } satisfies PlaceImage,
} as const;

export type WeatherCity = InlandForecastLocation & Readonly<{ coverImage?: PlaceImage }>;

export const cities: readonly WeatherCity[] = inlandForecastLocations.map((city) => {
  const coverImage = city.slug === "simferopol" ? simferopol.coverImage : cityCoverImages[city.slug];
  return { ...city, ...(coverImage ? { coverImage } : {}) };
});

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug) ?? null;
}
