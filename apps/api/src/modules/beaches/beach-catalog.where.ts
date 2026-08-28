import type { BeachCatalogQuery } from "@kuda-krym/contracts";
import { Prisma, PublicationStatus } from "@kuda-krym/database";

export function createPublishedBeachWhere(
  query: BeachCatalogQuery,
): Prisma.BeachWhereInput {
  return {
    publicationStatus: PublicationStatus.PUBLISHED,
    profile: { isNot: null },
    ...(query.region ? { region: query.region } : {}),
    ...(query.locality
      ? { locality: { equals: query.locality, mode: "insensitive" } }
      : {}),
    ...(query.q
      ? {
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { officialName: { contains: query.q, mode: "insensitive" } },
            { locality: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
  };
}
