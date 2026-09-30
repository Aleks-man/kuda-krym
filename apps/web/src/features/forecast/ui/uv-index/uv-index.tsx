import { getUvRisk } from "../../model/weather-details";
import styles from "./uv-index.module.css";

export function UvIndex({ value, inverse = false }: Readonly<{ value?: number | null; inverse?: boolean }>) {
  const risk = getUvRisk(value);
  const warning = value != null && value >= 6;
  return (
    <span data-warning={warning || undefined} className={styles.value} data-inverse={inverse || undefined} title={risk ? `${risk} уровень УФ-излучения` : "Нет данных"} aria-label={risk ? `${value?.toFixed(1)} — ${risk.toLowerCase()} уровень` : "Нет данных"}>
      {value?.toFixed(1) ?? "—"}
    </span>
  );
}
