import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCoastalLocation } from "@/features/coastal-locations/api/get-coastal-location";
import { CoastalLocationForecast } from "@/features/coastal-locations/ui/coastal-location-forecast/coastal-location-forecast";
import { CoastalLocationHero } from "@/features/coastal-locations/ui/coastal-location-hero/coastal-location-hero";
import { BeachForecastSkeleton } from "@/features/forecast/ui/beach-forecast/beach-forecast-skeleton";

import styles from "./page.module.css";

type CoastLocationPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({
  params,
}: CoastLocationPageProps): Promise<Metadata> {
  const { slug } = await params;
  const location = await getCoastalLocation(slug);

  return location
    ? {
        title: `Погода у моря — ${location.name}`,
        description: `Погода, ветер, волны и температура моря в ${location.name}.`,
      }
    : { title: "Прибрежная локация не найдена" };
}

export default async function CoastLocationPage({
  params,
}: CoastLocationPageProps) {
  const { slug } = await params;
  const location = await getCoastalLocation(slug);

  if (!location) notFound();

  return (
    <main className={styles.main}>
      <CoastalLocationHero location={location} />
      <Suspense fallback={<BeachForecastSkeleton />}>
        <CoastalLocationForecast slug={location.slug} />
      </Suspense>
    </main>
  );
}
