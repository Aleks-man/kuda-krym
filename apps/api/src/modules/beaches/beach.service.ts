import type { BeachListResponse } from "@kuda-krym/contracts";

import type { BeachRepository } from "./beach.repository.js";

export class BeachService {
  public constructor(private readonly beachRepository: BeachRepository) {}

  public async listPublished(): Promise<BeachListResponse> {
    const beaches = await this.beachRepository.findPublished();

    return {
      data: beaches,
      meta: { total: beaches.length },
    };
  }
}

