import type {
  WeatherForecast,
  WeatherForecastProvider,
  WeatherForecastRequest,
} from "../weather-forecast.js";
import { createFetchWithTimeout } from "../../../shared/http/fetch-with-timeout.js";
import { mapOpenMeteoResponse } from "./open-meteo.mapper.js";
import { openMeteoResponseSchema } from "./open-meteo-response.schema.js";

const hourlyVariables = [
  "temperature_2m",
  "precipitation_probability",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "cloud_cover",
];

type OpenMeteoWeatherClientOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  baseUrl?: string;
  now?: () => Date;
  timeoutMs?: number;
}>;

export class OpenMeteoWeatherClient implements WeatherForecastProvider {
  private readonly fetch: typeof globalThis.fetch;
  private readonly baseUrl: string;
  private readonly now: () => Date;

  public constructor(options: OpenMeteoWeatherClientOptions = {}) {
    this.fetch = createFetchWithTimeout({
      ...(options.fetch !== undefined ? { fetch: options.fetch } : {}),
      ...(options.timeoutMs !== undefined
        ? { timeoutMs: options.timeoutMs }
        : {}),
    });
    this.baseUrl = options.baseUrl ?? "https://api.open-meteo.com/v1/forecast";
    this.now = options.now ?? (() => new Date());
  }

  public async getForecast(
    request: WeatherForecastRequest,
  ): Promise<WeatherForecast> {
    const url = this.createUrl(request);
    const response = await this.fetch(url, {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo returned status ${response.status}`);
    }

    const payload = openMeteoResponseSchema.parse(await response.json());
    return mapOpenMeteoResponse(payload, this.now().toISOString());
  }

  private createUrl(request: WeatherForecastRequest): URL {
    const url = new URL(this.baseUrl);
    url.searchParams.set("latitude", request.location.latitude.toString());
    url.searchParams.set("longitude", request.location.longitude.toString());
    url.searchParams.set("hourly", hourlyVariables.join(","));
    url.searchParams.set("forecast_days", request.days.toString());
    url.searchParams.set("timezone", "GMT");
    url.searchParams.set("wind_speed_unit", "ms");
    return url;
  }
}
