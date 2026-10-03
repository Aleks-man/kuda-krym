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
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Сводка погоды по дням"><table>
      <caption>Температура воздуха, сумма осадков и максимальный ветер{showMarine ? ", средняя температура воды и максимальная высота волн" : ""}</caption>
      <thead><tr><th scope="col">День</th><th scope="col">Воздух, мин. / макс.</th><th scope="col">Осадки</th><th scope="col">Ветер, до</th>{showMarine ? <><th scope="col">Вода, средняя</th><th scope="col">Волны, до</th></> : null}</tr></thead>
      <tbody>{days.map(day => <tr key={day.dateKey}>
        <th scope="row"><time dateTime={day.dateKey}>{day.label}</time></th>
        <td>{formatMeasurement(day.minTemperature, "°C")} / {formatMeasurement(day.maxTemperature, "°C")}</td>
        <td>{formatMeasurement(day.precipitation, "мм", 1)}</td><td>{formatMeasurement(day.maxWind, "м/с", 1)}</td>
        {showMarine ? <><td>{formatMeasurement(day.waterTemperature, "°C", 1)}</td><td>{formatMeasurement(day.maxWave, "м", 1)}</td></> : null}
      </tr>)}</tbody>
    </table></div>
  </section>;
}
