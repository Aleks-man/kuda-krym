import type {
  ModelWeatherForecast,
  ModelWeatherForecastProvider,
  ModelWeatherForecastRequest,
  WeatherModel,
} from "../model-weather-forecast.js";
import { createFetchWithTimeout } from "../../../../shared/http/fetch-with-timeout.js";
import { mapOpenMeteoModelResponse } from "./open-meteo-model.mapper.js";
import { openMeteoModelConfig } from "./open-meteo-model.config.js";
import { openMeteoModelResponseSchema } from "./open-meteo-model-response.schema.js";

const hourlyVariables = [
  "temperature_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "cloud_cover",
];

type OpenMeteoModelWeatherClientOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  baseUrls?: Partial<Record<WeatherModel, string>>;
  now?: () => Date;
  timeoutMs?: number;
}>;

export class OpenMeteoModelWeatherClient
  implements ModelWeatherForecastProvider
{
  private readonly fetch: typeof globalThis.fetch;
  private readonly baseUrls: Partial<Record<WeatherModel, string>>;
  private readonly now: () => Date;

  public constructor(options: OpenMeteoModelWeatherClientOptions = {}) {
    this.fetch = createFetchWithTimeout({
      ...(options.fetch !== undefined ? { fetch: options.fetch } : {}),
      ...(options.timeoutMs !== undefined
        ? { timeoutMs: options.timeoutMs }
        : {}),
    });
    this.baseUrls = options.baseUrls ?? {};
    this.now = options.now ?? (() => new Date());
  }

  public async getForecast(
    request: ModelWeatherForecastRequest,
  ): Promise<ModelWeatherForecast> {
    const response = await this.fetch(this.createUrl(request), {
      headers: { accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(
        `Open-Meteo ${request.model} returned status ${response.status}`,
      );
    }

    const payload = openMeteoModelResponseSchema.parse(await response.json());
    return mapOpenMeteoModelResponse(
      request.model,
      payload,
      this.now().toISOString(),
    );
  }

  private createUrl(request: ModelWeatherForecastRequest): URL {
    const configuredUrl = this.baseUrls[request.model];
    const url = new URL(configuredUrl ?? openMeteoModelConfig[request.model].baseUrl);
    url.searchParams.set("latitude", request.location.latitude.toString());
    url.searchParams.set("longitude", request.location.longitude.toString());
    url.searchParams.set("hourly", hourlyVariables.join(","));
    url.searchParams.set("forecast_days", request.days.toString());
    url.searchParams.set("timezone", "GMT");
    url.searchParams.set("wind_speed_unit", "ms");
    return url;
  }
}
