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
  dayLimit = 3,
): ForecastDay[] {
  const upcoming = hourly.filter((hour) => asUtcDate(hour.time) >= now);
  const hasUpcomingHours = upcoming.length > 0;
  const available = hasUpcomingHours ? upcoming : hourly;
  const selectedHours = hasUpcomingHours
    ? selectDisplayHours(available, now)
    : available;
  const grouped = new Map<string, ForecastHour[]>();

  for (const hour of selectedHours) {
    const dateKey = getCrimeaDateKey(asUtcDate(hour.time));
    const dayHours = grouped.get(dateKey) ?? [];
    dayHours.push(hour);
    grouped.set(dateKey, dayHours);
  }

  return Array.from(grouped, ([dateKey, hours]) => ({
    dateKey,
    label: formatDayLabel(dateKey, now),
    hours,
  })).slice(0, dayLimit);
}

function selectDisplayHours(hours: ForecastHour[], now: Date): ForecastHour[] {
  const detailedHours = hours.slice(0, 6);
  const detailedTimes = new Set(detailedHours.map((hour) => hour.time));
  const lastDetailedTime = detailedHours.at(-1)
    ? asUtcDate(detailedHours.at(-1)!.time)
    : now;
  const todayKey = getCrimeaDateKey(now);

  return hours.filter((hour) => {
    if (detailedTimes.has(hour.time)) return true;

    const date = asUtcDate(hour.time);
    if (getCrimeaDateKey(date) === todayKey) {
      const hoursAfterDetailed = Math.round(
        (date.getTime() - lastDetailedTime.getTime()) / (60 * 60 * 1000),
      );
      return hoursAfterDetailed > 0 && hoursAfterDetailed % 2 === 0;
    }

    const localHour = getCrimeaHour(date);
    return localHour % 2 === 0;
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

function getCrimeaHour(date: Date): number {
  return Number(new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: crimeaTimeZone,
  }).format(date));
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
