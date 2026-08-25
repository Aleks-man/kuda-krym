import type {
  CoastalLocation,
  CoastalLocationListResponse,
} from "@kuda-krym/contracts";
import type { CoastalLocationRepository } from "./coastal-location.repository.js";

export class CoastalLocationService {
  public constructor(
    private readonly repository: CoastalLocationRepository,
  ) {}

  public async listPublished(): Promise<CoastalLocationListResponse> {
    const locations = await this.repository.findPublished();
    return { data: locations, meta: { total: locations.length } };
  }

  public getPublishedBySlug(slug: string): Promise<CoastalLocation | null> {
    return this.repository.findPublishedBySlug(slug);
  }
}
