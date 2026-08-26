import type { BeachForecast as BeachForecastData } from "@kuda-krym/contracts";

import { getBeachForecast } from "../../api/get-beach-forecast";
import { ForecastSummary } from "../forecast-summary/forecast-summary";
import styles from "./beach-forecast.module.css";

type BeachForecastProps = Readonly<{ beachId: string }>;

export async function BeachForecast({ beachId }: BeachForecastProps) {
  const forecast = await loadForecast(beachId);
  if (!forecast || forecast.hourly.length === 0) {
    return <ForecastUnavailable />;
  }

  return (
    <ForecastSummary
      currentLabel="Сейчас рядом с пляжем"
      eyebrow="Условия у воды"
      generatedAt={forecast.generatedAt}
      hours={forecast.hourly}
      title="Прогноз на ближайшие часы"
    />
  );
}

async function loadForecast(
  beachId: string,
): Promise<BeachForecastData | null> {
  try {
    return await getBeachForecast(beachId);
  } catch {
    return null;
  }
}

function ForecastUnavailable() {
  return (
    <section className={styles.unavailable}>
      <p>Прогноз временно недоступен</p>
      <span>Характеристики и проверенные сведения о пляже доступны ниже.</span>
    </section>
  );
}
