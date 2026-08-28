import type {
  BeachCatalogFilterOptions,
  BeachCatalogQuery,
  BeachDetail,
  BeachListResponse,
} from "@kuda-krym/contracts";

import type { BeachRepository } from "./beach.repository.js";

export class BeachService {
  public constructor(private readonly beachRepository: BeachRepository) {}

  public async listPublished(
    query: BeachCatalogQuery = {},
  ): Promise<BeachListResponse> {
    const beaches = await this.beachRepository.findPublished(query);

    return {
      data: beaches,
      meta: { total: beaches.length },
    };
  }

  public async getFilterOptions(): Promise<BeachCatalogFilterOptions> {
    return {
      data: await this.beachRepository.findPublishedFilterOptions(),
    };
  }

  public getPublishedBySlug(slug: string): Promise<BeachDetail | null> {
    return this.beachRepository.findPublishedBySlug(slug);
  }
}

