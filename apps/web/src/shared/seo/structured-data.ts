import { defaultSiteDescription, siteName } from "./page-metadata";

type Coordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

type PlaceStructuredDataOptions = Readonly<{
  type: "Place" | "TouristAttraction";
  name: string;
  description: string;
  pathname: `/${string}`;
  coordinates: Coordinates;
  siteUrl: URL;
}>;

export function createWebsiteStructuredData(siteUrl: URL) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: defaultSiteDescription,
    inLanguage: "ru",
    url: siteUrl.href,
  } as const;
}

export function createPlaceStructuredData({
  type,
  name,
  description,
  pathname,
  coordinates,
  siteUrl,
}: PlaceStructuredDataOptions) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    name,
    description,
    url: new URL(pathname, siteUrl).href,
    geo: {
      "@type": "GeoCoordinates",
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    },
  } as const;
}
