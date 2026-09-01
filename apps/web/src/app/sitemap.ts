import type { MetadataRoute } from "next";

import { getBeaches } from "@/features/beaches/api/get-beaches";
import { getCoastalLocations } from "@/features/coastal-locations/api/get-coastal-locations";
import { getSiteUrl } from "@/shared/config/site-url";
import { createSitemap } from "@/shared/seo/create-sitemap";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ data: beaches }, { data: coastalLocations }] = await Promise.all([
    getBeaches(),
    getCoastalLocations(),
  ]);

  return createSitemap({
    siteUrl: getSiteUrl(),
    beachSlugs: beaches.map(({ slug }) => slug),
    coastalLocationSlugs: coastalLocations.map(({ slug }) => slug),
  });
}
