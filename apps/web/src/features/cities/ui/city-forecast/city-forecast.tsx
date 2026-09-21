import { ForecastSummary } from "@/features/forecast/ui/forecast-summary/forecast-summary";
import { getCityForecast } from "../../api/get-city-forecast";

export async function CityForecast({ slug }: Readonly<{ slug: string }>) {
  const forecast = await getCityForecast(slug);
  if (forecast.hourly.length === 0) return null;

  return (
    <ForecastSummary
      catalogHref="/coast"
      currentLabel={forecast.city.name}
      eyebrow="Погода сейчас"
      generatedAt={forecast.generatedAt}
      freshness={forecast.freshness}
      currentWeather={forecast.currentWeather}
      hours={forecast.hourly}
      showMarine={false}
      sunTimes={forecast.sunTimes}
      title="Прогноз на ближайшие часы"
    />
  );
}
