import type {
  ForecastFreshness,
  ForecastHour,
  WeatherModelComparisonResponse,
} from "@kuda-krym/contracts";

import {
  formatForecastDate,
  formatMeasurement,
  selectUpcomingHours,
} from "../../model/forecast-view";
import { ConditionScores } from "../condition-scores/condition-scores";
import { ForecastConfidence } from "../forecast-confidence/forecast-confidence";
import { ForecastProvenance } from "../forecast-provenance/forecast-provenance";
import { ForecastFreshnessNotice } from "../forecast-freshness-notice/forecast-freshness-notice";
import { TwoDayForecast } from "../two-day-forecast/two-day-forecast";
import { WeatherModelComparison } from "../weather-model-comparison/weather-model-comparison";
import styles from "./forecast-summary.module.css";

type ForecastSummaryProps = Readonly<{
  currentLabel: string;
  eyebrow: string;
  generatedAt: string;
  freshness: ForecastFreshness;
  hours: ForecastHour[];
  modelComparison?: WeatherModelComparisonResponse | null;
  title: string;
}>;

export function ForecastSummary({
  currentLabel,
  eyebrow,
  generatedAt,
  freshness,
  hours: forecastHours,
  modelComparison,
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

      <ForecastFreshnessNotice freshness={freshness} />

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
      <ForecastConfidence confidence={current.confidence} />
      {modelComparison && (
        <WeatherModelComparison
          comparison={modelComparison}
          targetTime={current.time}
        />
      )}

      <TwoDayForecast hours={forecastHours} />

      <ForecastProvenance generatedAt={generatedAt} />
    </section>
  );
}
