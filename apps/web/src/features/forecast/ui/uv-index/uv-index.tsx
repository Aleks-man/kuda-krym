import { getUvRisk } from "../../model/weather-details";

export function UvIndex({ value, inverse = false }: Readonly<{ value?: number | null; inverse?: boolean }>) {
  const risk = getUvRisk(value);
  const warning = value != null && value >= 6;
  return (
    <span data-warning={warning || undefined} style={warning ? { color: inverse ? "#8c1710" : "#b42318", fontWeight: 800, ...(inverse ? { background: "#ffe8e5", borderRadius: 4, padding: "1px 4px" } : {}) } : undefined} title={risk ? `${risk} уровень УФ-излучения` : "Нет данных"} aria-label={risk ? `${value?.toFixed(1)} — ${risk.toLowerCase()} уровень` : "Нет данных"}>
      {value?.toFixed(1) ?? "—"}
    </span>
  );
}
