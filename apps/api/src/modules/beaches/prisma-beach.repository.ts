import type { BeachListItem } from "@kuda-krym/contracts";
import {
  PublicationStatus,
  type PrismaClient,
} from "@kuda-krym/database";

import type { BeachRepository } from "./beach.repository.js";

export class PrismaBeachRepository implements BeachRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublished(): Promise<BeachListItem[]> {
    const beaches = await this.prisma.beach.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
        profile: { isNot: null },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        region: true,
        locality: true,
        latitude: true,
        longitude: true,
        profile: {
          select: {
            surface: true,
            childSuitability: true,
          },
        },
        images: {
          where: { isCover: true },
          select: { url: true },
          take: 1,
        },
      },
      orderBy: { name: "asc" },
    });

    return beaches.map((beach) => {
      if (!beach.profile) {
        throw new Error(`Published beach ${beach.id} has no profile`);
      }

      return {
        id: beach.id,
        slug: beach.slug,
        name: beach.name,
        region: beach.region,
        locality: beach.locality,
        coordinates: {
          latitude: beach.latitude.toNumber(),
          longitude: beach.longitude.toNumber(),
        },
        surface: beach.profile.surface,
        childSuitability: beach.profile.childSuitability,
        coverImageUrl: beach.images[0]?.url ?? null,
      };
    });
  }
}

