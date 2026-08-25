import type { CoastalLocation } from "@kuda-krym/contracts";

export interface CoastalLocationRepository {
  findPublished(): Promise<CoastalLocation[]>;
  findPublishedBySlug(slug: string): Promise<CoastalLocation | null>;
}
