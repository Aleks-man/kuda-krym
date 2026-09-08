import type {
  ForecastFreshness,
  ForecastHour,
} from "@kuda-krym/contracts";

import { isCrimeaDaylight } from "../../model/crimea-daylight";
import {
  formatForecastUpdatedAt,
  formatMeasurement,
  selectUpcomingHours,
} from "../../model/forecast-view";
import { ConditionScores } from "../condition-scores/condition-scores";
import { ForecastConfidence } from "../forecast-confidence/forecast-confidence";
import { ForecastProvenance } from "../forecast-provenance/forecast-provenance";
import { ForecastFreshnessNotice } from "../forecast-freshness-notice/forecast-freshness-notice";
import { ForecastTimeline } from "../forecast-timeline/forecast-timeline";
import styles from "./forecast-summary.module.css";

type ForecastSummaryProps = Readonly<{
  currentLabel: string;
  eyebrow: string;
  generatedAt: string;
  freshness: ForecastFreshness;
  hours: ForecastHour[];
  title: string;
}>;

export function ForecastSummary({
  currentLabel,
  eyebrow,
  generatedAt,
  freshness,
  hours: forecastHours,
  title,
}: ForecastSummaryProps) {
  const hours = selectUpcomingHours(forecastHours);
  const current = hours[0]!;
  const sky = getSkyPresentation(current);

  return (
    <section className={styles.section} aria-labelledby="forecast-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="forecast-title">{title}</h2>
        </div>
      </div>

      <ForecastFreshnessNotice freshness={freshness} />

      <p className={styles.updated}>
        Обновлено{" "}
        <time dateTime={generatedAt}>{formatForecastUpdatedAt(generatedAt)}</time>
      </p>

      <div className={styles.now}>
        <div>
          <span
            aria-label={sky.label}
            className={styles.weatherIcon}
            data-sky={sky.variant}
            role="img"
          >
            <i className={styles.sun} />
            <svg aria-hidden="true" className={styles.moon} viewBox="0 0 32 32">
              <path d="M24.8 21.6A11.3 11.3 0 0 1 10.4 7.2 11.4 11.4 0 1 0 24.8 21.6Z" />
              <path className={styles.moonStar} d="m24.7 5 .8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Zm3.1 7.8.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5.5-1.1Z" />
            </svg>
            <i className={styles.cloud} />
          </span>
          <span className={styles.currentMeta}>
            <b>{currentLabel}</b>
            <span className={styles.skyStatus}>
              {sky.label} · облачность {current.weather.cloudCoverPercent}%
            </span>
          </span>
          <strong>{Math.round(current.weather.temperatureCelsius)}°</strong>
        </div>
        <dl className={styles.summary}>
          <div><dt>Вода</dt><dd>{formatMeasurement(current.marine.seaSurfaceTemperatureCelsius, "°C")}</dd></div>
          <div><dt>Волна</dt><dd>{formatMeasurement(current.marine.waveHeightMeters, "м", 1)}</dd></div>
          <div><dt>Ветер</dt><dd>{formatMeasurement(current.weather.windSpeedMetersPerSecond, "м/с", 1)}</dd></div>
          <div><dt>Осадки</dt><dd>{current.weather.precipitationProbabilityPercent}%</dd></div>
        </dl>
      </div>

      <ConditionScores scores={current.scores} />
      <ForecastConfidence confidence={current.confidence} />
      <ForecastTimeline generatedAt={generatedAt} hours={forecastHours} />

      <ForecastProvenance generatedAt={generatedAt} />
    </section>
  );
}

function getSkyPresentation(hour: ForecastHour) {
  const cloudCoverPercent = hour.weather.cloudCoverPercent;
  const isNight = !isCrimeaDaylight(hour.time);

  if (cloudCoverPercent < 30) {
    return { variant: isNight ? "clear-night" : "clear", label: "Ясно" } as const;
  }

  if (cloudCoverPercent < 70) {
    return { variant: isNight ? "partly-cloudy-night" : "partly-cloudy", label: "Переменная облачность" } as const;
  }

  return { variant: isNight ? "cloudy-night" : "cloudy", label: "Облачно" } as const;
}
