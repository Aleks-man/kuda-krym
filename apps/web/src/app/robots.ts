import type { MetadataRoute } from "next";

import { createSiteUrl } from "@/shared/config/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/compare"],
    },
    sitemap: createSiteUrl("/sitemap.xml").href,
  };
}
