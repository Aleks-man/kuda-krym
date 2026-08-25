import type { Metadata } from "next";

import { SiteHeader } from "@/shared/ui/site-header/site-header";

import "leaflet/dist/leaflet.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Куда.Крым",
    template: "%s | Куда.Крым",
  },
  description: "Подбор пляжей Крыма по погоде и состоянию моря.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

