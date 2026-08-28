import type { ForecastHour } from "@kuda-krym/contracts";

import { selectForecastDays } from "../../model/forecast-days";
import {
  formatForecastTime,
  formatMeasurement,
} from "../../model/forecast-view";
import styles from "./two-day-forecast.module.css";

type TwoDayForecastProps = Readonly<{
  hours: ForecastHour[];
}>;

export function TwoDayForecast({ hours }: TwoDayForecastProps) {
  const days = selectForecastDays(hours);

  if (days.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="two-day-title">
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Почасовой прогноз</p>
          <h3 id="two-day-title">Ближайшие два дня</h3>
        </div>
        <p>Время местное</p>
      </div>

      <div className={styles.days}>
        {days.map((day) => (
          <section className={styles.day} key={day.dateKey}>
            <header>
              <h4>{day.label}</h4>
              <span>Ключевые интервалы</span>
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
        <span>Уверенность</span>
        <strong>{hour.confidence.score}%</strong>
      </div>
    </article>
  );
}
