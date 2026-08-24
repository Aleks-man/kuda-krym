export const surfaceLabels = {
  UNKNOWN: "Покрытие не указано",
  SAND: "Песок",
  PEBBLE: "Галька",
  MIXED: "Смешанное покрытие",
  ROCK: "Скалы",
} as const;

export function formatMeasurement(
  value: number | null,
  unit: string,
  fractionDigits = 0,
) {
  return value === null ? "Нет данных" : `${value.toFixed(fractionDigits)} ${unit}`;
}
