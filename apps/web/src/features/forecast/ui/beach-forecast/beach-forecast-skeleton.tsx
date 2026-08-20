import styles from "./beach-forecast-skeleton.module.css";

export function BeachForecastSkeleton() {
  return (
    <section className={styles.section} aria-label="Загрузка прогноза">
      <div className={styles.title} />
      <div className={styles.panel} />
      <div className={styles.row} />
    </section>
  );
}
