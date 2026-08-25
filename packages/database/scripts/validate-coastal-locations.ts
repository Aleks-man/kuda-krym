import { seedCoastalLocations } from "../prisma/seed-data/coastal-locations.js";

const weatherUrl = "https://api.open-meteo.com/v1/forecast";
const marineUrl = "https://marine-api.open-meteo.com/v1/marine";
const failures: string[] = [];

for (const location of seedCoastalLocations) {
  const [weather, marine] = await Promise.all([
    requestForecast(weatherUrl, {
      latitude: location.weatherLatitude,
      longitude: location.weatherLongitude,
      hourly: "temperature_2m,wind_speed_10m",
    }),
    requestForecast(marineUrl, {
      latitude: location.marineLatitude,
      longitude: location.marineLongitude,
      hourly: "wave_height,sea_surface_temperature",
      cell_selection: "sea",
    }),
  ]);

  if (!weather.available) failures.push(`${location.slug}: weather unavailable`);
  if (!marine.available) failures.push(`${location.slug}: marine unavailable`);
}

if (failures.length > 0) {
  throw new Error(`Invalid coastal forecast points:\n${failures.join("\n")}`);
}

console.log(
  `Validated weather and marine forecasts for ${seedCoastalLocations.length} coastal locations.`,
);

async function requestForecast(
  baseUrl: string,
  parameters: Record<string, string>,
) {
  const url = new URL(baseUrl);
  for (const [name, value] of Object.entries(parameters)) {
    url.searchParams.set(name, value);
  }
  url.searchParams.set("forecast_days", "1");

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok) return { available: false };

  const payload = (await response.json()) as {
    hourly?: Record<string, unknown[] | undefined>;
  };
  const values = Object.values(payload.hourly ?? {}).flatMap((value) => value ?? []);
  return { available: values.some((value) => value !== null) };
}
