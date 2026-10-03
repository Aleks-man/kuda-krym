import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBeach } from "@/features/beaches/api/get-beach";
import { BeachCoastalLink } from "@/features/beaches/ui/beach-coastal-link/beach-coastal-link";
import { BeachDetailHero } from "@/features/beaches/ui/beach-detail-hero/beach-detail-hero";
import { BeachFacts } from "@/features/beaches/ui/beach-facts/beach-facts";
import { BeachForecast } from "@/features/forecast/ui/beach-forecast/beach-forecast";
import { createPageMetadata } from "@/shared/seo/page-metadata";
import { JsonLd } from "@/shared/seo/json-ld";
import { createPlaceStructuredData } from "@/shared/seo/structured-data";
import { getSiteUrl } from "@/shared/config/site-url";

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
    title: `${beach.name} — погода и температура моря`,
    description:
      `${beach.name}: прогноз погоды на 7 дней, температура воды, ветер и волны. ${beach.description ?? "Выбор пляжа в Крыму."}`,
    pathname: `/beaches/${beach.slug}`,
  });
}

export default async function BeachPage({ params }: BeachPageProps) {
  const { slug } = await params;
  const beach = await getBeach(slug);

  if (!beach) notFound();
  const description =
    beach.description ?? `Пляж ${beach.name} в каталоге Куда.Крым`;

  return (
    <>
      <JsonLd
        data={createPlaceStructuredData({
          type: "TouristAttraction",
          name: beach.name,
          description,
          pathname: `/beaches/${beach.slug}`,
          coordinates: beach.coordinates,
          siteUrl: getSiteUrl(),
        })}
      />
      <main className={styles.main}>
        <BeachDetailHero beach={beach} />
        <BeachCoastalLink coastalLocation={beach.coastalLocation} />
        <BeachForecast beachId={beach.id} />
        <BeachFacts beach={beach} />
      </main>
    </>
  );
}
