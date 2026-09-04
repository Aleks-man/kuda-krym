import type {
  BeachCatalogFilterOptions,
  BeachCatalogQuery,
  BeachDetail,
  BeachListItem,
} from "@kuda-krym/contracts";

export interface BeachRepository {
  findPublished(query?: BeachCatalogQuery): Promise<BeachListItem[]>;
  findPublishedByCoastalLocationSlug(slug: string): Promise<BeachListItem[]>;
  findPublishedFilterOptions(): Promise<BeachCatalogFilterOptions["data"]>;
  findPublishedBySlug(slug: string): Promise<BeachDetail | null>;
}

