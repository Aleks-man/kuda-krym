import type { Metadata } from "next";

import { getBeaches } from "@/features/beaches/api/get-beaches";
import { BeachEmptyState } from "@/features/beaches/ui/beach-empty-state/beach-empty-state";
import { BeachGrid } from "@/features/beaches/ui/beach-grid/beach-grid";
import { BeachMap } from "@/features/beaches/ui/beach-map/beach-map";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Пляжи Крыма",
  description: "Каталог пляжей Крыма с проверенными характеристиками.",
};

export const dynamic = "force-dynamic";

export default async function BeachesPage() {
  const { data: beaches, meta } = await getBeaches();

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Каталог</p>
        <h1>Пляжи Крыма</h1>
        <p className={styles.description}>
          Проверенные места для поездки — с понятными характеристиками и без
          догадок о важных условиях.
        </p>
        {meta.total > 0 && (
          <p className={styles.count}>Опубликовано: {meta.total}</p>
        )}
      </header>

      {beaches.length > 0 ? (
        <>
          <BeachMap beaches={beaches} />
          <BeachGrid beaches={beaches} />
        </>
      ) : (
        <BeachEmptyState />
      )}
    </main>
  );
}

