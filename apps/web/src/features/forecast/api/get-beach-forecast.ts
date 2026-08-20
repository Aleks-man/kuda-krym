import {
  beachForecastSchema,
  type BeachForecast,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getBeachForecast(
  beachId: string,
): Promise<BeachForecast | null> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(`/api/forecast/${encodeURIComponent(beachId)}?days=2`, apiUrl),
    { next: { revalidate: 600 } },
  );

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Forecast API returned status ${response.status}`);
  }

  return beachForecastSchema.parse(await response.json());
}
