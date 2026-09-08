import { cityForecastSchema, type CityForecast } from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getCityForecast(slug: string): Promise<CityForecast> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(`/api/cities/${encodeURIComponent(slug)}/forecast?days=3`, apiUrl),
    { next: { revalidate: 900 } },
  );
  if (!response.ok) {
    throw new Error(`City forecast API returned status ${response.status}`);
  }
  return cityForecastSchema.parse(await response.json());
}
