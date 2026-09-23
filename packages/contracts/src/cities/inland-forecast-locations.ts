export type InlandForecastLocation = Readonly<{
  slug: string;
  name: string;
  areaLabel: string;
  kind: "city" | "settlement";
  coordinates: Readonly<{ latitude: number; longitude: number }>;
}>;

// Shared by the API, search, map and public weather pages.
// Existing city coordinates follow recommendation-origin.config.ts.
// New settlement coordinates checked against Open-Meteo/GeoNames and map sources.
export const inlandForecastLocations: readonly InlandForecastLocation[] = [
  { slug: "simferopol", name: "Симферополь", areaLabel: "Городской округ Симферополь", kind: "city", coordinates: { latitude: 44.952117, longitude: 34.102417 } },
  { slug: "bakhchisaray", name: "Бахчисарай", areaLabel: "Бахчисарайский район", kind: "city", coordinates: { latitude: 44.7552, longitude: 33.8578 } },
  { slug: "dzhankoy", name: "Джанкой", areaLabel: "Городской округ Джанкой", kind: "city", coordinates: { latitude: 45.7131, longitude: 34.3927 } },
  { slug: "belogorsk", name: "Белогорск", areaLabel: "Белогорский район", kind: "city", coordinates: { latitude: 45.0568, longitude: 34.6039 } },
  { slug: "stary-krym", name: "Старый Крым", areaLabel: "Кировский район", kind: "city", coordinates: { latitude: 45.02887, longitude: 35.09174 } },
  { slug: "armyansk", name: "Армянск", areaLabel: "Муниципальный округ Армянск", kind: "city", coordinates: { latitude: 46.1092, longitude: 33.6921 } },
  { slug: "krasnoperekopsk", name: "Красноперекопск", areaLabel: "Городской округ Красноперекопск", kind: "city", coordinates: { latitude: 45.9555, longitude: 33.7926 } },
  { slug: "gvardeyskoye", name: "Гвардейское", areaLabel: "Симферопольский район", kind: "settlement", coordinates: { latitude: 45.11692, longitude: 34.02188 } },
  { slug: "krasnogvardeyskoye", name: "Красногвардейское", areaLabel: "Красногвардейский район", kind: "settlement", coordinates: { latitude: 45.5027, longitude: 34.3013 } },
  { slug: "nizhnegorsky", name: "Нижнегорский", areaLabel: "Нижнегорский район", kind: "settlement", coordinates: { latitude: 45.44789, longitude: 34.73839 } },
  { slug: "sovetsky", name: "Советский", areaLabel: "Советский район", kind: "settlement", coordinates: { latitude: 45.34267, longitude: 34.92463 } },
  { slug: "pervomayskoye", name: "Первомайское", areaLabel: "Первомайский район", kind: "settlement", coordinates: { latitude: 45.71616, longitude: 33.85771 } },
  { slug: "oktyabrskoye", name: "Октябрьское", areaLabel: "Красногвардейский район", kind: "settlement", coordinates: { latitude: 45.29148, longitude: 34.12532 } },
];

export function getInlandForecastLocation(slug: string): InlandForecastLocation | undefined {
  return inlandForecastLocations.find((location) => location.slug === slug);
}
