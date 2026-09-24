import type { MetadataRoute } from "next";

type SitemapSource = Readonly<{
  siteUrl: URL;
  beachSlugs: readonly string[];
  coastalLocationSlugs: readonly string[];
  citySlugs?: readonly string[];
}>;

export function createSitemap({
  siteUrl,
  beachSlugs,
  coastalLocationSlugs,
  citySlugs = [],
}: SitemapSource): MetadataRoute.Sitemap {
  return [
    entry(siteUrl, "/", "weekly", 1),
    entry(siteUrl, "/beaches", "daily", 0.9),
    entry(siteUrl, "/coast", "daily", 0.9),
    ...citySlugs.map((slug) =>
      entry(siteUrl, `/cities/${encodeURIComponent(slug)}`, "daily", 0.8),
    ),
    ...beachSlugs.map((slug) =>
      entry(siteUrl, `/beaches/${encodeURIComponent(slug)}`, "daily", 0.8),
    ),
    ...coastalLocationSlugs.map((slug) =>
      entry(siteUrl, `/coast/${encodeURIComponent(slug)}`, "daily", 0.8),
    ),
  ];
}

function entry(
  siteUrl: URL,
  pathname: string,
  changeFrequency: "daily" | "weekly",
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(pathname, siteUrl).href,
    changeFrequency,
    priority,
  };
}
