import type { ForecastFreshness } from "@kuda-krym/contracts";

import { formatForecastUpdatedAt } from "../../model/forecast-view";
import {
  getOldestStaleUpdate,
  getStaleSources,
} from "../../model/freshness-presentation";
import styles from "./forecast-freshness-notice.module.css";

type ForecastFreshnessNoticeProps = Readonly<{
  freshness: ForecastFreshness;
}>;

export function ForecastFreshnessNotice({
  freshness,
}: ForecastFreshnessNoticeProps) {
  const staleSources = getStaleSources(freshness);
  const oldestUpdate = getOldestStaleUpdate(staleSources);
  if (freshness.status === "FRESH" || !oldestUpdate) return null;

  return (
    <aside className={styles.notice} role="status" aria-live="polite">
      <div className={styles.icon} aria-hidden="true">!</div>
      <div>
        <p>Резервный прогноз</p>
        <h3>Часть данных временно не обновилась</h3>
        <span>
          Используем последнюю успешную копию: {staleSources
            .map(({ label }) => label)
            .join(", ")}. Данные получены {formatForecastUpdatedAt(oldestUpdate)}.
        </span>
      </div>
    </aside>
  );
}

export function MarineUnavailableNotice() {
  return (
    <aside className={styles.notice} role="status">
      <div className={styles.icon} aria-hidden="true">!</div>
      <div>
        <p>Морские данные недоступны</p>
        <h3>Показываем прогноз погоды</h3>
        <span>Сервис морского прогноза временно не отвечает. Температура воды и волны появятся после восстановления данных.</span>
      </div>
    </aside>
  );
}
