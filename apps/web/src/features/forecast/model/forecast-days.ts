import type { ForecastHour } from "@kuda-krym/contracts";

const crimeaTimeZone = "Europe/Moscow";
const millisecondsPerDay = 24 * 60 * 60 * 1000;

export type ForecastDay = Readonly<{
  dateKey: string;
  label: string;
  hours: ForecastHour[];
}>;

export function selectForecastDays(
  hourly: ForecastHour[],
  now = new Date(),
  dayLimit = 2,
  hourLimit = 8,
): ForecastDay[] {
  const upcoming = hourly.filter((hour) => asUtcDate(hour.time) >= now);
  const available = upcoming.length > 0 ? upcoming : hourly;
  const grouped = new Map<string, ForecastHour[]>();

  for (const hour of available) {
    const dateKey = getCrimeaDateKey(asUtcDate(hour.time));
    const dayHours = grouped.get(dateKey) ?? [];
    dayHours.push(hour);
    grouped.set(dateKey, dayHours);
  }

  return Array.from(grouped, ([dateKey, hours]) => ({
    dateKey,
    label: formatDayLabel(dateKey, now),
    hours: sampleHours(hours, hourLimit),
  })).slice(0, dayLimit);
}

function sampleHours(hours: ForecastHour[], limit: number): ForecastHour[] {
  if (hours.length <= limit) return hours;
  if (limit <= 1) return hours.slice(0, Math.max(0, limit));

  return Array.from({ length: limit }, (_, index) => {
    const sourceIndex = Math.round((index * (hours.length - 1)) / (limit - 1));
    return hours[sourceIndex]!;
  });
}

function formatDayLabel(dateKey: string, now: Date): string {
  const todayKey = getCrimeaDateKey(now);
  const tomorrowKey = getCrimeaDateKey(new Date(now.getTime() + millisecondsPerDay));
  const prefix = dateKey === todayKey
    ? "Сегодня"
    : dateKey === tomorrowKey
      ? "Завтра"
      : capitalize(formatWeekday(dateKey));

  return `${prefix}, ${formatDate(dateKey)}`;
}

function getCrimeaDateKey(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: crimeaTimeZone,
    year: "numeric",
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));

  return `${values.get("year")}-${values.get("month")}-${values.get("day")}`;
}

function formatDate(dateKey: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(dateKeyAsUtcDate(dateKey));
}

function formatWeekday(dateKey: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "UTC",
    weekday: "long",
  }).format(dateKeyAsUtcDate(dateKey));
}

function dateKeyAsUtcDate(dateKey: string): Date {
  return new Date(`${dateKey}T12:00:00Z`);
}

function asUtcDate(time: string): Date {
  return new Date(`${time}Z`);
}

function capitalize(value: string): string {
  return `${value.charAt(0).toLocaleUpperCase("ru-RU")}${value.slice(1)}`;
}
