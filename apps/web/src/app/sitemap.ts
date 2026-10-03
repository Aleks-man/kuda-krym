import { inlandForecastLocations } from "@kuda-krym/contracts";
import type { MetadataRoute } from "next";

import { getBeaches } from "@/features/beaches/api/get-beaches";
import { getCoastalLocations } from "@/features/coastal-locations/api/get-coastal-locations";
import { getSiteUrl } from "@/shared/config/site-url";
import { loadSitemapCatalog } from "@/shared/seo/load-sitemap-catalog";
import { createSitemap } from "@/shared/seo/create-sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const catalog = await loadSitemapCatalog(
    () => getBeaches({}, AbortSignal.timeout(8_000)),
    () => getCoastalLocations(AbortSignal.timeout(8_000)),
  );
  return createSitemap({
    siteUrl: getSiteUrl(),
    citySlugs: inlandForecastLocations.map(({ slug }) => slug),
    ...catalog,
  });
}
