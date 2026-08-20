import type {
  MarineForecast,
  MarineForecastProvider,
  MarineForecastRequest,
} from "../marine-forecast.js";
import { mapOpenMeteoMarineResponse } from "./open-meteo-marine.mapper.js";
import { openMeteoMarineResponseSchema } from "./open-meteo-marine-response.schema.js";

const hourlyVariables = [
  "sea_surface_temperature",
  "wave_height",
  "wave_direction",
  "wave_period",
];

type OpenMeteoMarineClientOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  baseUrl?: string;
  now?: () => Date;
}>;

export class OpenMeteoMarineClient implements MarineForecastProvider {
  private readonly fetch: typeof globalThis.fetch;
  private readonly baseUrl: string;
  private readonly now: () => Date;

  public constructor(options: OpenMeteoMarineClientOptions = {}) {
    this.fetch = options.fetch ?? globalThis.fetch;
    this.baseUrl =
      options.baseUrl ?? "https://marine-api.open-meteo.com/v1/marine";
    this.now = options.now ?? (() => new Date());
  }

  public async getForecast(
    request: MarineForecastRequest,
  ): Promise<MarineForecast> {
    const response = await this.fetch(this.createUrl(request), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`Open-Meteo Marine returned status ${response.status}`);
    }

    const payload = openMeteoMarineResponseSchema.parse(await response.json());
    return mapOpenMeteoMarineResponse(payload, this.now().toISOString());
  }

  private createUrl(request: MarineForecastRequest): URL {
    const url = new URL(this.baseUrl);
    url.searchParams.set("latitude", request.location.latitude.toString());
    url.searchParams.set("longitude", request.location.longitude.toString());
    url.searchParams.set("hourly", hourlyVariables.join(","));
    url.searchParams.set("forecast_days", request.days.toString());
    url.searchParams.set("timezone", "GMT");
    url.searchParams.set("cell_selection", "sea");
    return url;
  }
}
