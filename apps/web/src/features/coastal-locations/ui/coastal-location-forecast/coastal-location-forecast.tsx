import type { CoastalForecast as CoastalForecastData } from "@kuda-krym/contracts";

import { ForecastSummary } from "@/features/forecast/ui/forecast-summary/forecast-summary";

import { getCoastalForecast } from "../../api/get-coastal-forecast";
import styles from "./coastal-location-forecast.module.css";

type CoastalLocationForecastProps = Readonly<{ slug: string }>;

export async function CoastalLocationForecast({
  slug,
}: CoastalLocationForecastProps) {
  const forecast = await loadForecast(slug);

  if (!forecast || forecast.hourly.length === 0) {
    return (
      <section className={styles.unavailable}>
        <p>Прогноз временно недоступен</p>
        <span>Попробуйте обновить страницу немного позже.</span>
      </section>
    );
  }

  return (
    <ForecastSummary
      currentLabel={`Сейчас рядом с ${forecast.location.name}`}
      eyebrow="Условия у побережья"
      hours={forecast.hourly}
      title="Прогноз на ближайшие часы"
    />
  );
}

async function loadForecast(slug: string): Promise<CoastalForecastData | null> {
  try {
    return await getCoastalForecast(slug);
  } catch {
    return null;
  }
}
