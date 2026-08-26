import type { WeatherModelComparisonResponse } from "@kuda-krym/contracts";

import { formatForecastTime } from "../../model/forecast-view";
import {
  agreementLevelLabels,
  findNearestModelComparison,
  weatherModelLabels,
} from "../../model/weather-model-presentation";
import styles from "./weather-model-comparison.module.css";

type WeatherModelComparisonProps = Readonly<{
  comparison: WeatherModelComparisonResponse;
  targetTime: string;
}>;

export function WeatherModelComparison({
  comparison,
  targetTime,
}: WeatherModelComparisonProps) {
  const hour = findNearestModelComparison(comparison, targetTime);
  if (!hour) return null;

  return (
    <section className={styles.panel} aria-labelledby="model-comparison-title">
      <header className={styles.heading}>
        <div>
          <p>Проверка несколькими моделями</p>
          <h3 id="model-comparison-title">{agreementLevelLabels[hour.agreement.level]}</h3>
          <span>Расчёты на {formatForecastTime(hour.time)}</span>
        </div>
        <div className={styles.score}>
          <strong>{hour.agreement.score ?? "—"}</strong>
          {hour.agreement.score !== null && <span>%</span>}
        </div>
      </header>

      <div className={styles.models}>
        {hour.samples.map((sample) => (
          <article key={sample.model}>
            <strong>{weatherModelLabels[sample.model]}</strong>
            <dl>
              <div><dt>Температура</dt><dd>{Math.round(sample.conditions.temperatureCelsius)}°</dd></div>
              <div><dt>Ветер</dt><dd>{sample.conditions.windSpeedMetersPerSecond.toFixed(1)} м/с</dd></div>
              <div><dt>Осадки</dt><dd>{sample.conditions.precipitationMillimeters.toFixed(1)} мм</dd></div>
            </dl>
          </article>
        ))}
      </div>

      {comparison.models.failures.length > 0 && (
        <p className={styles.notice}>
          Временно недоступны: {comparison.models.failures
            .map(({ model }) => weatherModelLabels[model])
            .join(", ")}. Прогноз продолжает работать по доступным данным.
        </p>
      )}
    </section>
  );
}
