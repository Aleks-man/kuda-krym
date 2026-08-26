import {
  coastalForecastSchema,
  type CoastalForecast,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

export async function getCoastalForecast(
  slug: string,
): Promise<CoastalForecast> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const response = await fetch(
    new URL(
      `/api/coastal-locations/${encodeURIComponent(slug)}/forecast?days=2`,
      apiUrl,
    ),
    { next: { revalidate: 900 } },
  );

  if (!response.ok) {
    throw new Error(`Coastal forecast API returned status ${response.status}`);
  }

  return coastalForecastSchema.parse(await response.json());
}
