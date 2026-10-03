import type { ForecastHour } from "@kuda-krym/contracts";
import { formatDayLabel, getCrimeaDateKey } from "./forecast-days";

export function summarizeForecastDays(hours: ForecastHour[], now = new Date()) {
  const today = getCrimeaDateKey(now);
  const lastDay = getCrimeaDateKey(new Date(now.getTime() + 6 * 86_400_000));
  const grouped = new Map<string, ForecastHour[]>();
  for (const hour of hours) {
    const dateKey = getCrimeaDateKey(new Date(`${hour.time}Z`));
    if (dateKey < today || dateKey > lastDay) continue;
    const group = grouped.get(dateKey) ?? [];
    group.push(hour);
    grouped.set(dateKey, group);
  }
  return [...grouped].sort(([a], [b]) => a.localeCompare(b)).map(([dateKey, day]) => ({
    dateKey,
    label: formatDayLabel(dateKey, now),
    minTemperature: Math.min(...day.map(h => h.weather.temperatureCelsius)),
    maxTemperature: Math.max(...day.map(h => h.weather.temperatureCelsius)),
    precipitation: day.reduce((sum, h) => sum + h.weather.precipitationMillimeters, 0),
    maxWind: Math.max(...day.map(h => h.weather.windSpeedMetersPerSecond)),
    waterTemperature: nullableAverage(day.map(h => h.marine.seaSurfaceTemperatureCelsius)),
    maxWave: nullableMaximum(day.map(h => h.marine.waveHeightMeters)),
  }));
}

function nullableAverage(values: (number | null)[]) {
  const available = values.filter((v): v is number => v !== null);
  return available.length ? available.reduce((sum, v) => sum + v, 0) / available.length : null;
}

function nullableMaximum(values: (number | null)[]) {
  const available = values.filter((v): v is number => v !== null);
  return available.length ? Math.max(...available) : null;
}
