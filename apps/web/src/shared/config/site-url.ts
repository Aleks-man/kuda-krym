const defaultSiteUrl = "http://localhost:3000";

export function getSiteUrl(): URL {
  return parseSiteUrl(process.env.SITE_URL ?? defaultSiteUrl);
}

export function createSiteUrl(pathname: string): URL {
  return new URL(pathname, getSiteUrl());
}

export function parseSiteUrl(value: string): URL {
  const url = new URL(value);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("SITE_URL must use http or https");
  }

  if (url.username || url.password) {
    throw new Error("SITE_URL must not contain credentials");
  }

  if (url.pathname !== "/" || url.search || url.hash) {
    throw new Error("SITE_URL must contain only the public origin");
  }

  return url;
}
