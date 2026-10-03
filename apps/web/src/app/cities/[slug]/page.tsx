import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCity } from "@/features/cities/model/cities";
import { CityForecast } from "@/features/cities/ui/city-forecast/city-forecast";
import { CityHero } from "@/features/cities/ui/city-hero/city-hero";
import { ForecastLocationInfo } from "@/features/forecast/ui/forecast-location-info/forecast-location-info";
import { createPageMetadata } from "@/shared/seo/page-metadata";
import styles from "./page.module.css";

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const city = getCity((await params).slug);
  if (!city) return { title: "Населённый пункт не найден", robots: { index: false, follow: false } };
  return createPageMetadata({
    title: `Погода: ${city.name} — сегодня и на 7 дней`,
    description: `Погода сегодня и завтра: ${city.name}, Крым. Прогноз на 7 дней: температура воздуха, осадки и ветер.`,
    pathname: `/cities/${city.slug}`,
  });
}

export default async function CityPage({ params }: Props) {
  const city = getCity((await params).slug);
  if (!city) notFound();
  return (
    <main className={styles.main}>
      <CityHero city={city} />
      <CityForecast slug={city.slug} />
      <ForecastLocationInfo location={city} />
    </main>
  );
}
