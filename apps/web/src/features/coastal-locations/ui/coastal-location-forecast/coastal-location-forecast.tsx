import type { CoastalForecast as CoastalForecastData } from "@kuda-krym/contracts";

import { ForecastSummary } from "@/features/forecast/ui/forecast-summary/forecast-summary";
import { getWeatherModelComparison } from "@/features/forecast/api/get-weather-model-comparison";

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
  const modelComparison = await loadModelComparison(
    forecast.location.weatherCoordinates,
  );

  return (
    <ForecastSummary
      currentLabel={`Сейчас рядом с ${forecast.location.name}`}
      eyebrow="Условия у побережья"
      generatedAt={forecast.generatedAt}
      hours={forecast.hourly}
      modelComparison={modelComparison}
      title="Прогноз на ближайшие часы"
    />
  );
}

async function loadModelComparison(
  coordinates: CoastalForecastData["location"]["weatherCoordinates"],
) {
  try {
    return await getWeatherModelComparison(coordinates);
  } catch {
    return null;
  }
}

async function loadForecast(slug: string): Promise<CoastalForecastData | null> {
  try {
    return await getCoastalForecast(slug);
  } catch {
    return null;
  }
}
