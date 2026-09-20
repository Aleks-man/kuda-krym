import type { Metadata } from "next";

export const siteName = "Куда.Крым";
export const defaultSiteDescription =
  "Подбор пляжей Крыма по погоде, состоянию моря и времени в пути.";

export const socialImage = {
  url: "/social/kuda-krym-preview-v2.png",
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "Куда.Крым — подбор пляжей по погоде и состоянию моря",
} as const;
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
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}
