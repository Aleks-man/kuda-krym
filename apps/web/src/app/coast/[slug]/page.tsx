import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCoastalLocation } from "@/features/coastal-locations/api/get-coastal-location";
import { CoastalLocationBeaches } from "@/features/coastal-locations/ui/coastal-location-beaches/coastal-location-beaches";
import { CoastalLocationForecast } from "@/features/coastal-locations/ui/coastal-location-forecast/coastal-location-forecast";
import { CoastalLocationHero } from "@/features/coastal-locations/ui/coastal-location-hero/coastal-location-hero";
import { ForecastLocationInfo } from "@/features/forecast/ui/forecast-location-info/forecast-location-info";
import { createPageMetadata } from "@/shared/seo/page-metadata";
import { JsonLd } from "@/shared/seo/json-ld";
import { createPlaceStructuredData } from "@/shared/seo/structured-data";
import { getSiteUrl } from "@/shared/config/site-url";

import styles from "./page.module.css";

type CoastLocationPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({
  params,
}: CoastLocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getCoastalLocation(slug);

  if (!location) {
    return {
      title: "Прибрежная локация не найдена",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: `Погода: ${location.name} — сегодня и на 7 дней`,
    description: `Погода сегодня и завтра: ${location.name}, Крым. Прогноз на 7 дней: температура воздуха, осадки и ветер, температура воды в море и волны.`,
    pathname: `/coast/${location.slug}`,
  });
}

export default async function CoastLocationPage({
  params,
}: CoastLocationPageProps) {
  const { slug } = await params;
  const location = await getCoastalLocation(slug);

  if (!location) notFound();
  const description = `Погода, ветер, волны и температура моря в ${location.name}.`;

  return (
    <>
      <JsonLd
        data={createPlaceStructuredData({
          type: "Place",
          name: location.name,
          description,
          pathname: `/coast/${location.slug}`,
          coordinates: location.weatherCoordinates,
          siteUrl: getSiteUrl(),
        })}
      />
      <main className={styles.main}>
        <CoastalLocationHero location={location} />
        <CoastalLocationForecast slug={location.slug} />
        <Suspense fallback={null}>
          <CoastalLocationBeaches slug={location.slug} />
        </Suspense>
        <ForecastLocationInfo location={location} />
      </main>
    </>
  );
}
