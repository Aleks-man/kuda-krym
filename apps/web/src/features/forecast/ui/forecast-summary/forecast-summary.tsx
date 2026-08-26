import type { ForecastHour } from "@kuda-krym/contracts";

import {
  formatForecastDate,
  formatForecastTime,
  formatMeasurement,
  selectUpcomingHours,
} from "../../model/forecast-view";
import { ConditionScores } from "../condition-scores/condition-scores";
import styles from "./forecast-summary.module.css";

type ForecastSummaryProps = Readonly<{
  currentLabel: string;
  eyebrow: string;
  hours: ForecastHour[];
  title: string;
}>;

export function ForecastSummary({
  currentLabel,
  eyebrow,
  hours: forecastHours,
  title,
}: ForecastSummaryProps) {
  const hours = selectUpcomingHours(forecastHours);
  const current = hours[0]!;

  return (
    <section className={styles.section} aria-labelledby="forecast-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="forecast-title">{title}</h2>
        </div>
        <p className={styles.date}>{formatForecastDate(current.time)}</p>
      </div>

      <div className={styles.now}>
        <div>
          <span>{currentLabel}</span>
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

      <div className={styles.timeline}>
        {hours.map((hour) => (
          <article className={styles.hour} key={hour.time}>
            <time dateTime={`${hour.time}Z`}>{formatForecastTime(hour.time)}</time>
            <strong>{Math.round(hour.weather.temperatureCelsius)}°</strong>
            <span>Волна {formatMeasurement(hour.marine.waveHeightMeters, "м", 1)}</span>
            <small>Ветер {hour.weather.windSpeedMetersPerSecond.toFixed(1)} м/с</small>
          </article>
        ))}
      </div>

      <p className={styles.note}>
        Прогноз Open-Meteo ориентировочный и не предназначен для навигации.
      </p>
    </section>
  );
}
