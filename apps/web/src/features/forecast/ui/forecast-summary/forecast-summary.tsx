import type {
  CurrentWeather,
  ForecastFreshness,
  ForecastHour,
  ForecastSunTimes,
} from "@kuda-krym/contracts";

import { ForecastAutoRefresh } from "../forecast-auto-refresh/forecast-auto-refresh";
import { getCurrentWeatherPresentation, selectCurrentForecastHour } from "../../model/current-weather-presentation";
import { UvIndex } from "../uv-index/uv-index";
import { formatPressure, formatVisibility } from "../../model/weather-details";
import { isCrimeaDaylight } from "../../model/crimea-daylight";
import {
  formatForecastUpdatedAt,
  formatMeasurement,
} from "../../model/forecast-view";
import { ConditionScores } from "../condition-scores/condition-scores";
import { ForecastConfidence } from "../forecast-confidence/forecast-confidence";
import { ForecastProvenance } from "../forecast-provenance/forecast-provenance";
import { ForecastFreshnessNotice, MarineUnavailableNotice } from "../forecast-freshness-notice/forecast-freshness-notice";
import { ForecastTimeline } from "../forecast-timeline/forecast-timeline";
import styles from "./forecast-summary.module.css";

type ForecastSummaryProps = Readonly<{
  currentLabel: string;
  currentWeather?: CurrentWeather | null;
  catalogHref: "/beaches" | "/coast";
  eyebrow: string;
  generatedAt: string;
  freshness: ForecastFreshness;
  hours: ForecastHour[];
  showMarine?: boolean;
  sunTimes: ForecastSunTimes[];
  title: string;
}>;

export function ForecastSummary({
  currentLabel,
  currentWeather,
  catalogHref,
  eyebrow,
  generatedAt,
  freshness,
  hours: forecastHours,
  showMarine = true,
  sunTimes,
  title,
}: ForecastSummaryProps) {
  const current = selectCurrentForecastHour(forecastHours);
  const weather = currentWeather ?? current.weather;
  const conditionTime = currentWeather?.time ?? current.time;
  const isNight = currentWeather?.isDay == null ? !isCrimeaDaylight(conditionTime) : !currentWeather.isDay;
  const sky = getCurrentWeatherPresentation(weather, isNight);
  const specialIcon = ["rain", "heavy-rain", "snow", "thunder", "fog"].includes(sky.variant);

  return (
    <section className={styles.section} aria-labelledby="forecast-title">
      <ForecastAutoRefresh generatedAt={generatedAt} />
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id="forecast-title">{title}</h2>
        </div>
      </div>

      <ForecastFreshnessNotice freshness={freshness} />
      {showMarine && freshness.sources.marine === null ? <MarineUnavailableNotice /> : null}

      <p className={styles.updated}>
        Обновлено{" "}
        <time dateTime={generatedAt}>{formatForecastUpdatedAt(generatedAt)}</time>
      </p>

      <div className={styles.now} role="region" aria-label="Погода сейчас">
        <div>
          <span
            aria-label={sky.label}
            className={styles.weatherIcon}
            data-sky={sky.variant}
            role="img"
          >
            {specialIcon ? <ConditionsIcon variant={sky.variant} /> : <>
            <i className={styles.sun} />
            <svg aria-hidden="true" className={styles.moon} viewBox="0 0 32 32">
              <path d="M24.8 21.6A11.3 11.3 0 0 1 10.4 7.2 11.4 11.4 0 1 0 24.8 21.6Z" />
              <path className={styles.moonStar} d="m24.7 5 .8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Zm3.1 7.8.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5.5-1.1Z" />
            </svg>
            <i className={styles.cloud} />
            </>}
          </span>
          <span className={styles.currentMeta}>
            <span className={styles.skyStatus}>{currentWeather ? "Погода сейчас" : "Почасовой прогноз"}</span>
            <b>{currentLabel}</b>
            <span className={styles.skyStatus}>
              {sky.label} · облачность {weather.cloudCoverPercent}%
            </span>
          </span>
          <div className={styles.details}>
            <span>УФ-индекс <UvIndex value={weather.uvIndex} inverse /></span>
            <span>Давление {formatPressure(weather.surfacePressureHpa)}</span>
            <span>Видимость {formatVisibility(weather.visibilityMeters)}</span>
          </div>
          <div>
            <div className={styles.air} role="group" aria-label="Температура воздуха">
              <strong>{Math.round(weather.temperatureCelsius)}°</strong>
              <span>Ощущается как {formatMeasurement(weather.apparentTemperatureCelsius ?? null, "°C")}</span>
            </div>
          </div>
        </div>
        <dl className={styles.summary}>
          {showMarine ? <div><dt>Вода</dt><dd>{formatMeasurement(current.marine.seaSurfaceTemperatureCelsius, "°C")}</dd></div> : null}
          {showMarine ? <div><dt>Волна</dt><dd>{formatMeasurement(current.marine.waveHeightMeters, "м", 1)}</dd></div> : null}
          <div><dt>Ветер</dt><dd>{formatMeasurement(weather.windSpeedMetersPerSecond, "м/с", 1)}</dd></div>
          <div><dt>Порывы</dt><dd>{formatMeasurement(weather.windGustMetersPerSecond, "м/с", 1)}</dd></div>
          <div><dt>{currentWeather ? `Осадки за ${Math.round(currentWeather.intervalSeconds / 60)} мин` : "Осадки за час"}</dt><dd>{formatMeasurement(weather.precipitationMillimeters, "мм", weather.precipitationMillimeters > 0 && weather.precipitationMillimeters < 0.1 ? 2 : 1)}</dd></div>
          {!showMarine ? <div><dt>Облачность</dt><dd>{weather.cloudCoverPercent}%</dd></div> : null}
          <div><dt>Влажность</dt><dd>{formatMeasurement(weather.relativeHumidityPercent ?? null, "%")}</dd></div>
        </dl>
      </div>

      {showMarine ? <ConditionScores scores={current.scores} /> : null}
      <ForecastConfidence confidence={current.confidence} />
      <ForecastTimeline locationName={currentLabel} catalogHref={catalogHref} generatedAt={generatedAt} hours={forecastHours} showMarine={showMarine} sunTimes={sunTimes} />

      <ForecastProvenance generatedAt={generatedAt} showMarine={showMarine} />
    </section>
  );
}

function ConditionsIcon({ variant }: Readonly<{ variant: string }>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 48 44" width="48" height="44" fill="none">
      <path d="M10 26a7 7 0 0 1-1-14 10 10 0 0 1 19-2 8 8 0 0 1 9 16Z" fill="#e8f3f1" />
      {variant === "thunder" ? <path d="m25 24-7 11h7l-4 8 13-13h-8l4-6Z" fill="#ffe99a" /> :
        variant === "snow" ? <path d="M17 30v10m-4-8 8 6m-8 0 8-6m13-2v10m-4-8 8 6m-8 0 8-6" stroke="white" strokeWidth="2" /> :
        variant === "fog" ? <path d="M6 31h35M10 37h28" stroke="#c6dedf" strokeWidth="2" strokeLinecap="round" /> :
        <path d={variant === "heavy-rain" ? "m14 30-3 7m12-7-3 7m12-7-3 7m-12 3-1 3m12-3-1 3" : "m16 30-3 7m13-7-3 7m13-7-3 7"} stroke="#b7eaff" strokeWidth="2.5" strokeLinecap="round" />}
    </svg>
  );
}
