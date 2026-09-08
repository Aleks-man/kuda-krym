"use client";

import type { ForecastHour } from "@kuda-krym/contracts";
import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type RefObject } from "react";
import { isCrimeaDaylight } from "../../model/crimea-daylight";
import { selectForecastDays } from "../../model/forecast-days";
import { formatForecastTime, formatForecastUpdatedAt, formatMeasurement } from "../../model/forecast-view";
import styles from "./forecast-timeline.module.css";

type Props = Readonly<{ generatedAt: string; hours: ForecastHour[]; showMarine?: boolean }>;
type DragState = { pointerId: number; startX: number; scrollLeft: number };

export function ForecastTimeline({ generatedAt, hours, showMarine = true }: Props) {
  const days = selectForecastDays(hours);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState>({ pointerId: -1, startX: 0, scrollLeft: 0 });
  const [selectedDate, setSelectedDate] = useState(days[0]?.dateKey ?? "");
  const selectedDay = days.find((day) => day.dateKey === selectedDate) ?? days[0];
  if (!selectedDay) return null;

  const timelineHours = days.flatMap((day) => day.hours.map((hour) => ({ dateKey: day.dateKey, hour })));
  const temperatures = timelineHours.map(({ hour }) => hour.weather.temperatureCelsius);
  const minimumTemperature = Math.min(...temperatures);
  const maximumTemperature = Math.max(...temperatures);

  return (
    <section className={styles.section} aria-labelledby="forecast-timeline-title">
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Почасовой прогноз</p>
        <h3 id="forecast-timeline-title">Ближайшие три дня</h3>
      </div>
      <div aria-label="День прогноза" className={styles.tabs} role="tablist">
        {days.map((day) => (
          <button aria-controls="forecast-days-timeline" aria-selected={day.dateKey === selectedDay.dateKey} key={day.dateKey} onClick={() => scrollToDay(scrollerRef.current, day.dateKey)} role="tab" type="button">
            {day.label}
          </button>
        ))}
      </div>
      <section aria-label={selectedDay.label} className={styles.day} id="forecast-days-timeline" role="tabpanel">
        <header>
          <strong>{selectedDay.label}</strong>
          <div className={styles.dayActions}>
            <p className={styles.updated}>Обновлено <time dateTime={generatedAt}>{formatForecastUpdatedAt(generatedAt)}</time></p>
          </div>
        </header>
        <div
          className={styles.scroller}
          onPointerCancel={(event) => endDragging(event, dragRef)}
          onPointerDown={(event) => startDragging(event, dragRef)}
          onPointerMove={(event) => moveTimeline(event, dragRef)}
          onPointerUp={(event) => endDragging(event, dragRef)}
          onScroll={(event) => {
            const dateKey = getVisibleDate(event.currentTarget);
            if (dateKey && dateKey !== selectedDate) setSelectedDate(dateKey);
          }}
          ref={scrollerRef}
        >
          <div className={styles.timeline}>
            {timelineHours.map(({ dateKey, hour }, index) => (
              <ForecastHourCard
                dateKey={dateKey}
                hour={hour}
                isDayStart={index === 0 || timelineHours[index - 1]?.dateKey !== dateKey}
                key={`${dateKey}-${hour.time}`}
                maximumTemperature={maximumTemperature}
                minimumTemperature={minimumTemperature}
                showMarine={showMarine}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function scrollToDay(scroller: HTMLDivElement | null, dateKey: string) {
  const target = scroller?.querySelector<HTMLElement>(`[data-date="${dateKey}"]`);
  scroller?.scrollTo({ behavior: "smooth", left: target?.offsetLeft ?? 0 });
}

function getVisibleDate(scroller: HTMLDivElement) {
  const targetX = scroller.scrollLeft + Math.min(80, scroller.clientWidth / 3);
  const cards = Array.from(scroller.querySelectorAll<HTMLElement>("[data-date]"));
  return cards.find((card) => card.offsetLeft + card.offsetWidth > targetX)?.dataset.date;
}

function startDragging(event: ReactPointerEvent<HTMLDivElement>, dragRef: RefObject<DragState>) {
  if (event.pointerType !== "mouse" || event.button !== 0) return;
  Object.assign(dragRef.current, { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft });
  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.dataset.dragging = "true";
}

function moveTimeline(event: ReactPointerEvent<HTMLDivElement>, dragRef: RefObject<DragState>) {
  if (dragRef.current.pointerId !== event.pointerId) return;
  event.preventDefault();
  event.currentTarget.scrollLeft = dragRef.current.scrollLeft - (event.clientX - dragRef.current.startX);
}

function endDragging(event: ReactPointerEvent<HTMLDivElement>, dragRef: RefObject<DragState>) {
  if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  dragRef.current.pointerId = -1;
  delete event.currentTarget.dataset.dragging;
}

type CardProps = Readonly<{ dateKey: string; hour: ForecastHour; isDayStart: boolean; maximumTemperature: number; minimumTemperature: number; showMarine: boolean }>;

function ForecastHourCard({ dateKey, hour, isDayStart, maximumTemperature, minimumTemperature, showMarine }: CardProps) {
  const weather = getWeatherPresentation(hour);
  const temperaturePosition = getTemperaturePosition(hour.weather.temperatureCelsius, minimumTemperature, maximumTemperature);
  return (
    <article className={styles.hour} data-date={dateKey} data-day-start={isDayStart || undefined}>
      <time dateTime={`${hour.time}Z`}>{formatForecastTime(hour.time)}</time>
      <span aria-label={weather.label} className={styles.weatherSymbol} data-weather={weather.variant} role="img">
        <i className={styles.sun} />
        <svg aria-hidden="true" className={styles.moon} viewBox="0 0 32 32">
          <path d="M24.8 21.6A11.3 11.3 0 0 1 10.4 7.2 11.4 11.4 0 1 0 24.8 21.6Z" />
          <path className={styles.moonStar} d="m24.7 5 .8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Zm3.1 7.8.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5.5-1.1Z" />
        </svg>
        <i className={styles.cloud} /><i className={styles.rain} />
      </span>
      <small className={styles.weatherLabel}>{weather.label}</small>
      {weather.precipitation ? (
        <small className={styles.precipitation}>{weather.precipitation}</small>
      ) : null}
      <div className={styles.temperature}>
        <strong>{Math.round(hour.weather.temperatureCelsius)}°</strong>
        <span aria-hidden="true" className={styles.temperatureScale}><i style={{ width: `${temperaturePosition}%` }} /></span>
      </div>
      <dl className={styles.metrics}>
        {showMarine ? <div><dt>Вода</dt><dd>{formatMeasurement(hour.marine.seaSurfaceTemperatureCelsius, "°C")}</dd></div> : null}
        {showMarine ? <div><dt>Волна</dt><dd>{formatMeasurement(hour.marine.waveHeightMeters, "м", 1)}</dd></div> : null}
        <div><dt>Вероятность дождя</dt><dd>{hour.weather.precipitationProbabilityPercent}%</dd></div>
      </dl>
      <div
        aria-label={`Ветер с ${formatWindDirectionName(hour.weather.windDirectionDegrees)}`}
        className={styles.wind}
        title={`${formatWindDirection(hour.weather.windDirectionDegrees)} — ветер с ${formatWindDirectionName(hour.weather.windDirectionDegrees)}`}
      >
        <div className={styles.windDirection}>
          <span
            aria-hidden="true"
            style={{ "--wind-direction": `${hour.weather.windDirectionDegrees + 180}deg` } as CSSProperties}
          >
            ↑
          </span>
          <small>{formatWindDirection(hour.weather.windDirectionDegrees)}</small>
        </div>
        <div className={styles.windDetails}>
          <small>Ветер</small>
          <strong>{hour.weather.windSpeedMetersPerSecond.toFixed(1)} м/с</strong>
        </div>
      </div>
      <div className={styles.confidence}><span>Надёжность прогноза</span><strong>{hour.confidence.score}%</strong></div>
    </article>
  );
}

function getTemperaturePosition(value: number, minimum: number, maximum: number) {
  if (minimum === maximum) return 55;
  return 18 + ((value - minimum) / (maximum - minimum)) * 72;
}

function formatWindDirection(degrees: number) {
  const directions = ["С", "СВ", "В", "ЮВ", "Ю", "ЮЗ", "З", "СЗ"] as const;
  return directions[Math.round(degrees / 45) % directions.length];
}

function formatWindDirectionName(degrees: number) {
  const directions = [
    "севера",
    "северо-востока",
    "востока",
    "юго-востока",
    "юга",
    "юго-запада",
    "запада",
    "северо-запада",
  ] as const;
  return directions[Math.round(degrees / 45) % directions.length];
}

function getWeatherPresentation(hour: ForecastHour) {
  const { precipitationMillimeters: rain, precipitationProbabilityPercent: rainProbability, cloudCoverPercent: cloudCover } = hour.weather;
  const isNight = !isCrimeaDaylight(hour.time);
  if (rain >= 2) {
    return {
      variant: "heavy-rain",
      label: "Сильный дождь",
      precipitation: `${rain.toFixed(1)} мм осадков`,
    } as const;
  }
  if (rain >= 0.2 || rainProbability >= 55) {
    return {
      variant: "rain",
      label: "Дождь",
      precipitation: rain > 0 ? `${rain.toFixed(1)} мм осадков` : null,
    } as const;
  }
  if (cloudCover >= 70) return { variant: "cloudy", label: "Облачно" } as const;
  if (cloudCover >= 30) return { variant: isNight ? "partly-cloudy-night" : "partly-cloudy", label: "Переменная облачность" } as const;
  return { variant: isNight ? "clear-night" : "clear", label: "Ясно" } as const;
}
