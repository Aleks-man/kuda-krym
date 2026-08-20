import type { BeachListItem } from "@kuda-krym/contracts";

export interface BeachRepository {
  findPublished(): Promise<BeachListItem[]>;
}

