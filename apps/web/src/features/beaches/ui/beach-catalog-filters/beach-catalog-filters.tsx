import type {
  BeachCatalogFilterOptions,
  BeachCatalogQuery,
} from "@kuda-krym/contracts";
import Link from "next/link";

import { SelectField } from "@/shared/ui/select-field/select-field";

import { getBeachRegionLabel } from "../../model/beach-labels";
import styles from "./beach-catalog-filters.module.css";

type BeachCatalogFiltersProps = Readonly<{
  query: BeachCatalogQuery;
  options: BeachCatalogFilterOptions["data"];
}>;

export function BeachCatalogFilters({
  query,
  options,
}: BeachCatalogFiltersProps) {
  const hasActiveFilters = Object.keys(query).length > 0;

  return (
    <section className={styles.panel} aria-labelledby="catalog-filter-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Фильтры каталога</p>
          <h2 id="catalog-filter-title">Выберите часть побережья</h2>
        </div>
        <p className={styles.note}>
          Показываем только опубликованные пляжи выбранного региона.
        </p>
      </div>

      <form
        action="/beaches"
        aria-label="Фильтры пляжей"
        className={styles.form}
        method="get"
        role="search"
      >
        <SelectField
          initialValue={query.region ?? ""}
          key={query.region ?? "all"}
          label="Регион"
          name="region"
          options={[
            { value: "", label: "Весь Крым" },
            ...options.regions.map((region) => ({
              value: region,
              label: getBeachRegionLabel(region),
            })),
          ]}
          submitOnChange
        />

        {hasActiveFilters ? (
          <div className={styles.actions}>
            <Link className={styles.reset} href="/beaches">
              Сбросить
            </Link>
          </div>
        ) : null}
      </form>
    </section>
  );
}
