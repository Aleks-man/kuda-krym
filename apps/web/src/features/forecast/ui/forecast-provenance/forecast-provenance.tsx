import { formatForecastUpdatedAt } from "../../model/forecast-view";
import styles from "./forecast-provenance.module.css";

type ForecastProvenanceProps = Readonly<{
  generatedAt: string;
}>;

const sources = [
  {
    label: "Погода — Open-Meteo Forecast API",
    href: "https://open-meteo.com/en/docs",
  },
  {
    label: "Море — Open-Meteo Marine API",
    href: "https://open-meteo.com/en/docs/marine-weather-api",
  },
] as const;

export function ForecastProvenance({ generatedAt }: ForecastProvenanceProps) {
  return (
    <aside className={styles.panel} aria-label="Источники и ограничения прогноза">
      <div>
        <span className={styles.label}>Обновлено</span>
        <time dateTime={generatedAt}>{formatForecastUpdatedAt(generatedAt)}</time>
      </div>
      <div>
        <span className={styles.label}>Источники</span>
        <ul>
          {sources.map((source) => (
            <li key={source.href}>
              <a href={source.href} rel="noreferrer" target="_blank">
                {source.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p>
        Данные рассчитываются по численным моделям и могут отличаться от фактических
        условий. Морской прогноз не предназначен для навигации.
      </p>
    </aside>
  );
}
