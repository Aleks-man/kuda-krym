import type { CoastalLocationBeachesResponse } from "@kuda-krym/contracts";

import type { BeachRepository } from "../beaches/beach.repository.js";
import type { CoastalLocationRepository } from "./coastal-location.repository.js";

type CoastalLocationBeachesDependencies = Readonly<{
  beachRepository: Pick<
    BeachRepository,
    "findPublishedByCoastalLocationSlug"
  >;
  coastalLocationRepository: Pick<
    CoastalLocationRepository,
    "findPublishedBySlug"
  >;
}>;

export class CoastalLocationBeachesService {
  public constructor(
    private readonly dependencies: CoastalLocationBeachesDependencies,
  ) {}

  public async listPublished(
    slug: string,
  ): Promise<CoastalLocationBeachesResponse | null> {
    const location =
      await this.dependencies.coastalLocationRepository.findPublishedBySlug(slug);

    if (!location) {
      return null;
    }

    const beaches =
      await this.dependencies.beachRepository.findPublishedByCoastalLocationSlug(
        slug,
      );

    return {
      location,
      data: beaches,
      meta: { total: beaches.length },
    };
  }
}
