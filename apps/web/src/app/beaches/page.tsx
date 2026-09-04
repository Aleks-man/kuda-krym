import { getBeachCatalogFilterOptions } from "@/features/beaches/api/get-beach-catalog-filter-options";
import { getBeaches } from "@/features/beaches/api/get-beaches";
import {
  parseBeachCatalogSearchParams,
  type BeachCatalogSearchParams,
} from "@/features/beaches/model/parse-beach-catalog-search-params";
import { BeachCatalogFilters } from "@/features/beaches/ui/beach-catalog-filters/beach-catalog-filters";
import { BeachEmptyState } from "@/features/beaches/ui/beach-empty-state/beach-empty-state";
import { BeachGrid } from "@/features/beaches/ui/beach-grid/beach-grid";
import { BeachMap } from "@/features/beaches/ui/beach-map/beach-map";
import { createPageMetadata } from "@/shared/seo/page-metadata";

import styles from "./page.module.css";

export const metadata = createPageMetadata({
  title: "Пляжи Крыма",
  description: "Каталог конкретных пляжей Крыма с точками на карте.",
  pathname: "/beaches",
});

export const dynamic = "force-dynamic";

type BeachesPageProps = Readonly<{
  searchParams: Promise<BeachCatalogSearchParams>;
}>;

export default async function BeachesPage({ searchParams }: BeachesPageProps) {
  const query = parseBeachCatalogSearchParams(await searchParams);
  const [{ data: beaches, meta }, { data: filterOptions }] = await Promise.all([
    getBeaches(query),
    getBeachCatalogFilterOptions(),
  ]);
  const hasActiveFilters = Object.keys(query).length > 0;

  return (
    <main className={styles.main}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>Конкретные места</p>
        <h1>Пляжи Крыма</h1>
        <p className={styles.description}>
          Выбирайте конкретный пляж по расположению и подтверждённым сведениям.
          Общий прогноз погоды и моря для районов находится в разделе «Прогноз».
        </p>
        {(meta.total > 0 || hasActiveFilters) && (
          <p className={styles.count} aria-live="polite">
            {hasActiveFilters ? "Найдено" : "Опубликовано"}: {meta.total}
          </p>
        )}
      </header>

      <BeachCatalogFilters options={filterOptions} query={query} />

      {beaches.length > 0 ? (
        <>
          <BeachMap beaches={beaches} />
          <BeachGrid beaches={beaches} />
        </>
      ) : (
        <BeachEmptyState filtered={hasActiveFilters} />
      )}
    </main>
  );
}

