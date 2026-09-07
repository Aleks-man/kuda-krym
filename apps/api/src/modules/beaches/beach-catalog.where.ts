import type { BeachCatalogQuery } from "@kuda-krym/contracts";
import { Prisma, PublicationStatus } from "@kuda-krym/database";

export function createPublishedBeachWhere(
  query: BeachCatalogQuery,
): Prisma.BeachWhereInput {
  return {
    publicationStatus: PublicationStatus.PUBLISHED,
    profile: { isNot: null },
    ...(query.region ? { region: query.region } : {}),
  };
}
