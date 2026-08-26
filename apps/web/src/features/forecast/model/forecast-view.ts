import type { ForecastHour } from "@kuda-krym/contracts";

const crimeaTimeZone = "Europe/Moscow";

function asUtcDate(time: string): Date {
  return new Date(`${time}Z`);
}

export function selectUpcomingHours(
  hourly: ForecastHour[],
  now = new Date(),
  limit = 8,
): ForecastHour[] {
  const upcoming = hourly.filter((hour) => asUtcDate(hour.time) >= now);
  return (upcoming.length > 0 ? upcoming : hourly).slice(0, limit);
}

export function formatForecastTime(time: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: crimeaTimeZone,
  }).format(asUtcDate(time));
}

export function formatForecastDate(time: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: crimeaTimeZone,
  }).format(asUtcDate(time));
}

export function formatMeasurement(
  value: number | null,
  unit: string,
  digits = 0,
): string {
  return value === null ? "—" : `${value.toFixed(digits)} ${unit}`;
}
