import type {
  DrivingRoute,
  RouteRequest,
  RoutingProvider,
} from "../route.js";
import { mapOsrmResponse } from "./osrm.mapper.js";
import { osrmResponseSchema } from "./osrm-response.schema.js";

type OsrmClientOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  baseUrl?: string;
  now?: () => Date;
}>;

export class OsrmClient implements RoutingProvider {
  private readonly fetch: typeof globalThis.fetch;
  private readonly baseUrl: string;
  private readonly now: () => Date;

  public constructor(options: OsrmClientOptions = {}) {
    this.fetch = options.fetch ?? globalThis.fetch;
    this.baseUrl = options.baseUrl ?? "https://router.project-osrm.org/";
    this.now = options.now ?? (() => new Date());
  }

  public async getDrivingRoute(request: RouteRequest): Promise<DrivingRoute> {
    const response = await this.fetch(this.createUrl(request), {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      throw new Error(`OSRM returned status ${response.status}`);
    }

    const payload = osrmResponseSchema.parse(await response.json());
    return mapOsrmResponse(payload, request, this.now().toISOString());
  }

  private createUrl({ origin, destination }: RouteRequest) {
    const coordinates = [origin, destination]
      .map(({ longitude, latitude }) => `${longitude},${latitude}`)
      .join(";");
    const url = new URL(`route/v1/driving/${coordinates}`, this.baseUrl);
    url.searchParams.set("overview", "full");
    url.searchParams.set("geometries", "geojson");
    url.searchParams.set("steps", "false");
    return url;
  }
}
