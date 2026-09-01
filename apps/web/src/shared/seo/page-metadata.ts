import type { Metadata } from "next";

export const siteName = "Куда.Крым";
export const defaultSiteDescription =
  "Подбор пляжей Крыма по погоде, состоянию моря и времени в пути.";

type PageMetadataOptions = Readonly<{
  title: string;
  description: string;
  pathname: `/${string}`;
}>;

export function createPageMetadata({
  title,
  description,
  pathname,
}: PageMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName,
      title,
      description,
      url: pathname,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}
