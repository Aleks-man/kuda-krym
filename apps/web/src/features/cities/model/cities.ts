import { cityCoverImages, inlandForecastLocations, type InlandForecastLocation, type PlaceImage } from "@kuda-krym/contracts";

export type WeatherCity = InlandForecastLocation & Readonly<{ coverImage?: PlaceImage }>;

const covers: Readonly<Partial<Record<string, PlaceImage>>> = cityCoverImages;

export const cities: readonly WeatherCity[] = inlandForecastLocations.map((city) => {
  const coverImage = covers[city.slug];
  return { ...city, ...(coverImage ? { coverImage } : {}) };
});

export function getCity(slug: string) {
  return cities.find((city) => city.slug === slug) ?? null;
}
