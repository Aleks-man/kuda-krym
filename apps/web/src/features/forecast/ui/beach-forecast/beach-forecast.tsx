import type { BeachForecast as BeachForecastData } from "@kuda-krym/contracts";

import { getBeachForecast } from "../../api/get-beach-forecast";
import {
  formatForecastDate,
  formatForecastTime,
  formatMeasurement,
  selectUpcomingHours,
} from "../../model/forecast-view";
import { ConditionScores } from "../condition-scores/condition-scores";
import styles from "./beach-forecast.module.css";

type BeachForecastProps = Readonly<{ beachId: string }>;

export async function BeachForecast({ beachId }: BeachForecastProps) {
  const forecast = await loadForecast(beachId);
  if (!forecast || forecast.hourly.length === 0) {
    return <ForecastUnavailable />;
  }

  const hours = selectUpcomingHours(forecast.hourly);
  const current = hours[0]!;

  return (
      <section className={styles.section} aria-labelledby="forecast-title">
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Условия у воды</p>
            <h2 id="forecast-title">Прогноз на ближайшие часы</h2>
          </div>
          <p className={styles.date}>{formatForecastDate(current.time)}</p>
        </div>

        <div className={styles.now}>
          <div>
            <span>Сейчас рядом с пляжем</span>
            <strong>{Math.round(current.weather.temperatureCelsius)}°</strong>
          </div>
          <dl className={styles.summary}>
            <div>
              <dt>Вода</dt>
              <dd>
                {formatMeasurement(
                  current.marine.seaSurfaceTemperatureCelsius,
                  "°C",
                )}
              </dd>
            </div>
            <div>
              <dt>Волна</dt>
              <dd>
                {formatMeasurement(current.marine.waveHeightMeters, "м", 1)}
              </dd>
            </div>
            <div>
              <dt>Ветер</dt>
              <dd>
                {formatMeasurement(
                  current.weather.windSpeedMetersPerSecond,
                  "м/с",
                  1,
                )}
              </dd>
            </div>
            <div>
              <dt>Осадки</dt>
              <dd>{current.weather.precipitationProbabilityPercent}%</dd>
            </div>
          </dl>
        </div>

        <ConditionScores scores={current.scores} />

        <div className={styles.timeline}>
          {hours.map((hour) => (
            <article className={styles.hour} key={hour.time}>
              <time dateTime={`${hour.time}Z`}>
                {formatForecastTime(hour.time)}
              </time>
              <strong>{Math.round(hour.weather.temperatureCelsius)}°</strong>
              <span>
                Волна {formatMeasurement(hour.marine.waveHeightMeters, "м", 1)}
              </span>
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

async function loadForecast(
  beachId: string,
): Promise<BeachForecastData | null> {
  try {
    return await getBeachForecast(beachId);
  } catch {
    return null;
  }
}

function ForecastUnavailable() {
  return (
    <section className={styles.unavailable}>
      <p>Прогноз временно недоступен</p>
      <span>Характеристики и проверенные сведения о пляже доступны ниже.</span>
    </section>
  );
}
