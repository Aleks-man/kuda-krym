import {
  weatherModelComparisonResponseSchema,
  type WeatherModelComparisonResponse,
} from "@kuda-krym/contracts";

const defaultApiUrl = "http://127.0.0.1:4000";

type ForecastCoordinates = Readonly<{
  latitude: number;
  longitude: number;
}>;

export async function getWeatherModelComparison(
  coordinates: ForecastCoordinates,
): Promise<WeatherModelComparisonResponse> {
  const apiUrl = process.env.API_URL ?? defaultApiUrl;
  const url = new URL("/api/weather/model-comparison", apiUrl);
  url.searchParams.set("latitude", String(coordinates.latitude));
  url.searchParams.set("longitude", String(coordinates.longitude));
  url.searchParams.set("days", "2");

  const response = await fetch(url, { next: { revalidate: 900 } });
  if (!response.ok) {
    throw new Error(`Weather model comparison API returned status ${response.status}`);
  }

  return weatherModelComparisonResponseSchema.parse(await response.json());
}
