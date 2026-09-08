import type { RecommendationResponse } from "@kuda-krym/contracts";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
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
            <div className={styles.visual}>
              {item.beach.coastalLocation?.coverImage ? (
                <Image
                  alt={item.beach.coastalLocation.coverImage.alt}
                  className={styles.image}
                  fill
                  sizes="(max-width: 900px) calc(100vw - 72px), 360px"
                  src={item.beach.coastalLocation.coverImage.url}
                />
              ) : (
                <span aria-hidden="true" className={styles.imageFallback} />
              )}
              <span aria-hidden="true" className={styles.imageShade} />
            </div>
            <div className={styles.cardHeader}>
              <span className={styles.position}>Вариант № {item.position}</span>
              <div
                aria-label={`Общая оценка условий: ${item.score} из 100`}
                className={styles.score}
                style={{ "--score": item.score } as CSSProperties}
              >
                <strong>{item.score}</strong>
                <small>из 100</small>
              </div>
            </div>
            <h4>{item.beach.coastalLocation?.name ?? item.beach.name}</h4>
            <p>{item.beach.name}</p>
            <RecommendationTravel travel={item.travel} />
            <dl>
              <div><dt>Море</dt><dd>{formatMeasurement(item.conditions.seaSurfaceTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Волна</dt><dd>{formatMeasurement(item.conditions.waveHeightMeters, "м", 1)}</dd></div>
              <div><dt>Воздух</dt><dd>{formatMeasurement(item.conditions.airTemperatureCelsius, "°C")}</dd></div>
              <div><dt>Ветер</dt><dd>{formatMeasurement(item.conditions.windSpeedMetersPerSecond, "м/с", 1)}</dd></div>
            </dl>
            <Link
              aria-label={`Открыть ${item.beach.coastalLocation ? `прогноз для ${item.beach.coastalLocation.name}` : `пляж ${item.beach.name}`}`}
              className={styles.cardLink}
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
