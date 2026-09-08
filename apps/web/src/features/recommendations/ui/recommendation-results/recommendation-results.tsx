import type { RecommendationResponse } from "@kuda-krym/contracts";
import Link from "next/link";
import { formatMeasurement } from "../../model/recommendation-labels";
import { RecommendationTravel } from "../recommendation-travel/recommendation-travel";
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

  return (
    <section
      aria-labelledby="recommendation-results-title"
      aria-live="polite"
      className={styles.results}
    >
      <header>
        <p>Результат подбора</p>
        <h3 id="recommendation-results-title">Куда лучше поехать к морю</h3>
        <span>Проверили {result.meta.candidateCount} вариантов по дороге, погоде и морю.</span>
      </header>
      <div className={styles.grid}>
        {result.data.map((item) => (
          <article className={styles.card} key={item.beach.id}>
            <div className={styles.cardHeader}>
              <span>№ {item.position}</span>
              <strong>{item.score}<small>/100</small></strong>
            </div>
            <h4>{item.beach.coastalLocation?.name ?? item.beach.name}</h4>
            <p>{item.beach.name} · уверенность {item.confidencePercent}%</p>
            <RecommendationTravel travel={item.travel} />
            <dl>
              <div><dt>Море</dt><dd>{formatMeasurement(item.conditions.seaSurfaceTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Волна</dt><dd>{formatMeasurement(item.conditions.waveHeightMeters, "м", 1)}</dd></div>
              <div><dt>Воздух</dt><dd>{formatMeasurement(item.conditions.airTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Ветер</dt><dd>{formatMeasurement(item.conditions.windSpeedMetersPerSecond, "м/с", 1)}</dd></div>
            </dl>
            <Link
              href={
                item.beach.coastalLocation
                  ? `/coast/${item.beach.coastalLocation.slug}`
                  : `/beaches/${item.beach.slug}`
              }
            >
              {item.beach.coastalLocation ? "Открыть прогноз" : "Открыть пляж"}{" "}
              <span>→</span>
            </Link>
          </article>
        ))}
      </div>
      <Link className={styles.more} href="/coast">
        Другие варианты у моря <span>→</span>
      </Link>
    </section>
  );
}
