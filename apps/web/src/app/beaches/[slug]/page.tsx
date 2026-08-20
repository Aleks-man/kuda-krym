import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBeach } from "@/features/beaches/api/get-beach";
import { BeachDetailHero } from "@/features/beaches/ui/beach-detail-hero/beach-detail-hero";
import { BeachFacts } from "@/features/beaches/ui/beach-facts/beach-facts";
import { BeachSources } from "@/features/beaches/ui/beach-sources/beach-sources";

import styles from "./page.module.css";

type BeachPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: BeachPageProps): Promise<Metadata> {
  const { slug } = await params;
  const beach = await getBeach(slug);

  return beach
    ? { title: beach.name, description: beach.description ?? `Пляж ${beach.name} в каталоге Куда.Крым` }
    : { title: "Пляж не найден" };
}

export default async function BeachPage({ params }: BeachPageProps) {
  const { slug } = await params;
  const beach = await getBeach(slug);

  if (!beach) notFound();

  return (
    <main className={styles.main}>
      <BeachDetailHero beach={beach} />
      <BeachFacts beach={beach} />
      <BeachSources beach={beach} />
    </main>
  );
}
