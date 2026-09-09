import type { Metadata } from "next";

import { SiteHeader } from "@/shared/ui/site-header/site-header";
import { SiteBackground } from "@/shared/ui/site-background/site-background";
import { getSiteUrl } from "@/shared/config/site-url";
import {
  defaultSiteDescription,
  siteName,
} from "@/shared/seo/page-metadata";
import { JsonLd } from "@/shared/seo/json-ld";
import { createWebsiteStructuredData } from "@/shared/seo/structured-data";
import { SkipLink } from "@/shared/ui/skip-link/skip-link";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultSiteDescription,
  icons: {
    icon: [{ url: "/brand/kuda-krym-mark.svg", type: "image/svg+xml" }],
    shortcut: "/brand/kuda-krym-mark.svg",
  },
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName,
    title: siteName,
    description: defaultSiteDescription,
    url: "/",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description: defaultSiteDescription,
  },
  robots: { index: true, follow: true },
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>
        <SkipLink />
        <JsonLd data={createWebsiteStructuredData(getSiteUrl())} />
        <SiteHeader />
        <div id="main-content" tabIndex={-1}>
          <SiteBackground />
          {children}
        </div>
      </body>
    </html>
  );
}

