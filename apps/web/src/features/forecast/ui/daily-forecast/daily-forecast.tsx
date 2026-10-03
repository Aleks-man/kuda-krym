import type { ForecastHour } from "@kuda-krym/contracts";
import { summarizeForecastDays } from "../../model/daily-forecast";
import { formatMeasurement } from "../../model/forecast-view";
import styles from "./daily-forecast.module.css";
export function DailyForecast({ hours, showMarine }: Readonly<{ hours: ForecastHour[]; showMarine: boolean }>) {
  const days = summarizeForecastDays(hours);
  if (!days.length) return null;
  return <section className={styles.section} aria-labelledby="daily-forecast-title">
    <h3 id="daily-forecast-title">Погода сегодня, завтра и на 7 дней</h3>
    <p>Сводка по доступным часам каждого дня. Время местное, московское; для неполного дня показатели охватывают только доступные часы.</p>
    <div className={styles.forecast} role="region" aria-label="Сводка погоды по дням"><table role="table" data-marine={showMarine}>
      <caption>Температура воздуха, сумма осадков и максимальный ветер{showMarine ? ", средняя температура воды и максимальная высота волн" : ""}</caption>
      <thead role="rowgroup"><tr role="row"><th role="columnheader" scope="col">День</th><th role="columnheader" scope="col">Воздух, мин. / макс.</th><th role="columnheader" scope="col">Осадки</th><th role="columnheader" scope="col">Ветер, до</th>{showMarine ? <><th role="columnheader" scope="col">Вода, средняя</th><th role="columnheader" scope="col">Волны, до</th></> : null}</tr></thead>
      <tbody role="rowgroup">{days.map(day => <tr role="row" key={day.dateKey}>
        <th role="rowheader" scope="row"><time dateTime={day.dateKey}>{day.label}</time></th>
        <td role="cell" className={styles.air}><span className={styles.metricLabel} aria-hidden="true">Воздух, мин. / макс.</span>{formatMeasurement(day.minTemperature, "°C")} / {formatMeasurement(day.maxTemperature, "°C")}</td>
        <td role="cell"><span className={styles.metricLabel} aria-hidden="true">Осадки</span>{formatMeasurement(day.precipitation, "мм", 1)}</td><td role="cell"><span className={styles.metricLabel} aria-hidden="true">Ветер, до</span>{formatMeasurement(day.maxWind, "м/с", 1)}</td>
        {showMarine ? <><td role="cell" className={styles.water}><span className={styles.metricLabel} aria-hidden="true">Вода, ср.</span>{formatMeasurement(day.waterTemperature, "°C", 1)}</td><td role="cell"><span className={styles.metricLabel} aria-hidden="true">Волны, до</span>{formatMeasurement(day.maxWave, "м", 1)}</td></> : null}
      </tr>)}</tbody>
    </table></div>
  </section>;
}
