import type { RecommendationResponse } from "@kuda-krym/contracts";
import Link from "next/link";
import {
  formatMeasurement,
  surfaceLabels,
} from "../../model/recommendation-labels";
import styles from "./recommendation-results.module.css";

type RecommendationResultsProps = {
  result: RecommendationResponse;
};

export function RecommendationResults({ result }: RecommendationResultsProps) {
  if (result.data.length === 0) {
    return (
      <div className={styles.empty} role="status">
        Для этих условий подходящих пляжей пока нет. Попробуйте изменить параметры.
      </div>
    );
  }

  const comparisonUrl = `/compare?beaches=${result.data
    .map(({ beach }) => beach.slug)
    .join(",")}`;

  return (
    <section className={styles.results} aria-live="polite">
      <header>
        <p>Результат подбора</p>
        <h3>Лучшие варианты на выбранное время</h3>
        <span>Сравнили {result.meta.candidateCount} пляжей по погоде и морю.</span>
      </header>
      <div className={styles.grid}>
        {result.data.map((item) => (
          <article className={styles.card} key={item.beach.id}>
            <div className={styles.cardHeader}>
              <span>№ {item.position}</span>
              <strong>{item.score}<small>/100</small></strong>
            </div>
            <h4>{item.beach.name}</h4>
            <p>{surfaceLabels[item.beach.surface]} · уверенность {item.confidencePercent}%</p>
            <dl>
              <div><dt>Море</dt><dd>{formatMeasurement(item.conditions.seaSurfaceTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Волна</dt><dd>{formatMeasurement(item.conditions.waveHeightMeters, "м", 1)}</dd></div>
              <div><dt>Воздух</dt><dd>{formatMeasurement(item.conditions.airTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Ветер</dt><dd>{formatMeasurement(item.conditions.windSpeedMetersPerSecond, "м/с", 1)}</dd></div>
            </dl>
            <Link href={`/beaches/${item.beach.slug}`}>Открыть пляж <span>→</span></Link>
          </article>
        ))}
      </div>
      {result.data.length >= 2 ? (
        <Link className={styles.compare} href={comparisonUrl}>
          Сравнить эти пляжи <span>→</span>
        </Link>
      ) : null}
    </section>
  );
}
