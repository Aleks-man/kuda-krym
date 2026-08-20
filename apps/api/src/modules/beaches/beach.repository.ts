import type { BeachDetail, BeachListItem } from "@kuda-krym/contracts";

export interface BeachRepository {
  findPublished(): Promise<BeachListItem[]>;
  findPublishedBySlug(slug: string): Promise<BeachDetail | null>;
}

