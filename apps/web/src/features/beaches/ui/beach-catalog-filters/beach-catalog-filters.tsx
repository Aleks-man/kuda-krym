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
          <p className={styles.eyebrow}>Поиск места</p>
          <h2 id="catalog-filter-title">Найдите пляж на побережье</h2>
        </div>
        <p className={styles.note}>
          Фильтры используют только проверенные названия и расположение.
        </p>
      </div>

      <form action="/beaches" className={styles.form} method="get">
        <label className={`${styles.field} ${styles.search}`}>
          <span>Название или населённый пункт</span>
          <input
            defaultValue={query.q ?? ""}
            maxLength={100}
            name="q"
            placeholder="Например, Ялта или Золотой пляж"
            type="search"
          />
        </label>

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

        <label className={styles.field}>
          <span>Населённый пункт</span>
          <select defaultValue={query.locality ?? ""} name="locality">
            <option value="">Все места</option>
            {options.localities.map((locality) => (
              <option key={locality} value={locality}>
                {locality}
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
