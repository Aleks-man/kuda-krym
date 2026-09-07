import type {
  BeachCatalogFilterOptions,
  BeachCatalogQuery,
} from "@kuda-krym/contracts";
import Link from "next/link";

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
        <label className={styles.field}>
          <span>Регион</span>
          <select defaultValue={query.region ?? ""} name="region">
            <option value="">Весь Крым</option>
            {options.regions.map((region) => (
              <option key={region} value={region}>
                {getBeachRegionLabel(region)}
              </option>
            ))}
          </select>
        </label>

        <div className={styles.actions}>
          <button type="submit">Показать</button>
          {hasActiveFilters ? (
            <Link className={styles.reset} href="/beaches">
              Сбросить
            </Link>
          ) : null}
        </div>
      </form>
    </section>
  );
}
