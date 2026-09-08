import type { ForecastHour } from "@kuda-krym/contracts";

import { selectForecastDays } from "../../model/forecast-days";
import {
  formatForecastTime,
  formatForecastUpdatedAt,
  formatMeasurement,
} from "../../model/forecast-view";
import styles from "./forecast-timeline.module.css";

type ForecastTimelineProps = Readonly<{
  generatedAt: string;
  hours: ForecastHour[];
}>;

export function ForecastTimeline({ generatedAt, hours }: ForecastTimelineProps) {
  const days = selectForecastDays(hours);

  if (days.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="forecast-timeline-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Почасовой прогноз</p>
          <h3 id="forecast-timeline-title">Ближайшие три дня</h3>
        </div>
      </div>

      <div className={styles.days}>
        {days.map((day) => (
          <section className={styles.day} key={day.dateKey}>
            <header>
              <h4>{day.label}</h4>
              <p className={styles.updated}>
                Обновлено{" "}
                <time dateTime={generatedAt}>
                  {formatForecastUpdatedAt(generatedAt)}
                </time>
              </p>
            </header>

            <div className={styles.timeline}>
              {day.hours.map((hour) => (
                <ForecastHourCard hour={hour} key={hour.time} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function ForecastHourCard({ hour }: Readonly<{ hour: ForecastHour }>) {
  return (
    <article className={styles.hour}>
      <div className={styles.hourHeading}>
        <time dateTime={`${hour.time}Z`}>{formatForecastTime(hour.time)}</time>
        <strong>{Math.round(hour.weather.temperatureCelsius)}°</strong>
      </div>

      <dl className={styles.metrics}>
        <div>
          <dt>Вода</dt>
          <dd>
            {formatMeasurement(
              hour.marine.seaSurfaceTemperatureCelsius,
              "°C",
            )}
          </dd>
        </div>
        <div>
          <dt>Волна</dt>
          <dd>{formatMeasurement(hour.marine.waveHeightMeters, "м", 1)}</dd>
        </div>
        <div>
          <dt>Ветер</dt>
          <dd>{hour.weather.windSpeedMetersPerSecond.toFixed(1)} м/с</dd>
        </div>
        <div>
          <dt>Осадки</dt>
          <dd>{hour.weather.precipitationProbabilityPercent}%</dd>
        </div>
      </dl>

      <div className={styles.confidence}>
        <span>Надёжность прогноза</span>
        <strong>{hour.confidence.score}%</strong>
      </div>
    </article>
  );
}
