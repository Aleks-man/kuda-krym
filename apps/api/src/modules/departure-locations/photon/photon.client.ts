import type { DepartureLocation } from "@kuda-krym/contracts";

import { createFetchWithTimeout } from "../../../shared/http/fetch-with-timeout.js";
import type { DepartureLocationProvider } from "../departure-location.provider.js";
import { crimeaSearchBoundingBox } from "../crimea-search-area.js";
import { mapPhotonFeatures } from "./photon.mapper.js";
import { photonResponseSchema } from "./photon-response.schema.js";

type PhotonClientOptions = Readonly<{
  fetch?: typeof globalThis.fetch;
  baseUrl?: string;
  timeoutMs?: number;
}>;

export class PhotonClient implements DepartureLocationProvider {
  private readonly fetch: typeof globalThis.fetch;
  private readonly baseUrl: string;

  public constructor(options: PhotonClientOptions = {}) {
    this.fetch = createFetchWithTimeout({
      ...(options.fetch !== undefined ? { fetch: options.fetch } : {}),
      ...(options.timeoutMs !== undefined
        ? { timeoutMs: options.timeoutMs }
        : {}),
    });
    this.baseUrl = options.baseUrl ?? "https://photon.komoot.io/";
  }

  public async search(query: string): Promise<DepartureLocation[]> {
    const response = await this.fetch(this.createUrl(query), {
      headers: {
        accept: "application/json",
        "user-agent": "Kuda-Krym/0.1 departure-location-search",
      },
    });

    if (!response.ok) {
      throw new Error(`Photon returned status ${response.status}`);
    }

    const payload = photonResponseSchema.parse(await response.json());
    return mapPhotonFeatures(payload.features);
  }

  private createUrl(query: string): URL {
    const url = new URL("api", this.baseUrl);
    const bounds = crimeaSearchBoundingBox;

    url.searchParams.set("q", query);
    url.searchParams.set(
      "bbox",
      [
        bounds.minLongitude,
        bounds.minLatitude,
        bounds.maxLongitude,
        bounds.maxLatitude,
      ].join(","),
    );
    url.searchParams.set("lang", "ru");
    url.searchParams.set("limit", "12");
    url.searchParams.append("layer", "city");
    url.searchParams.append("layer", "locality");
    return url;
  }
}
