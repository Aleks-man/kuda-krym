import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getCity } from "@/features/cities/model/cities";
import { CityForecast } from "@/features/cities/ui/city-forecast/city-forecast";
import { CityHero } from "@/features/cities/ui/city-hero/city-hero";
import { BeachForecastSkeleton } from "@/features/forecast/ui/beach-forecast/beach-forecast-skeleton";
import { createPageMetadata } from "@/shared/seo/page-metadata";
import styles from "./page.module.css";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity((await params).slug);
  if (!city) return { title: "Город не найден", robots: { index: false, follow: false } };
  return createPageMetadata({
    title: `Погода — ${city.name}`,
    description: `Погода в ${city.name}: температура, осадки, облачность и ветер.`,
    pathname: `/cities/${city.slug}`,
  });
}

export default async function CityPage({ params }: Props) {
  const city = getCity((await params).slug);
  if (!city) notFound();
  return (
    <main className={styles.main}>
      <CityHero />
      <Suspense fallback={<BeachForecastSkeleton />}>
        <CityForecast slug={city.slug} />
      </Suspense>
    </main>
  );
}
