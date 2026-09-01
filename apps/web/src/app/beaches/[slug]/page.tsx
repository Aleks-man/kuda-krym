import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getBeach } from "@/features/beaches/api/get-beach";
import { BeachDetailHero } from "@/features/beaches/ui/beach-detail-hero/beach-detail-hero";
import { BeachFacts } from "@/features/beaches/ui/beach-facts/beach-facts";
import { BeachSources } from "@/features/beaches/ui/beach-sources/beach-sources";
import { BeachForecast } from "@/features/forecast/ui/beach-forecast/beach-forecast";
import { BeachForecastSkeleton } from "@/features/forecast/ui/beach-forecast/beach-forecast-skeleton";
import { createPageMetadata } from "@/shared/seo/page-metadata";

import styles from "./page.module.css";

type BeachPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({
  params,
}: BeachPageProps): Promise<Metadata> {
  const { slug } = await params;
  const beach = await getBeach(slug);

  if (!beach) {
    return {
      title: "Пляж не найден",
      robots: { index: false, follow: false },
    };
  }

  return createPageMetadata({
    title: beach.name,
    description:
      beach.description ?? `Пляж ${beach.name} в каталоге Куда.Крым`,
    pathname: `/beaches/${beach.slug}`,
  });
}

export default async function BeachPage({ params }: BeachPageProps) {
  const { slug } = await params;
  const beach = await getBeach(slug);

  if (!beach) notFound();

  return (
    <main className={styles.main}>
      <BeachDetailHero beach={beach} />
      <Suspense fallback={<BeachForecastSkeleton />}>
        <BeachForecast beachId={beach.id} />
      </Suspense>
      <BeachFacts beach={beach} />
      <BeachSources beach={beach} />
    </main>
  );
}
