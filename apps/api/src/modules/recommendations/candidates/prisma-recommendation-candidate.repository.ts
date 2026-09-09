import { PublicationStatus, type PrismaClient } from "@kuda-krym/database";

import type { RecommendationCandidate } from "./recommendation-candidate.js";
import type { RecommendationCandidateRepository } from "./recommendation-candidate.repository.js";

export class PrismaRecommendationCandidateRepository
  implements RecommendationCandidateRepository
{
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublished(): Promise<RecommendationCandidate[]> {
    const beaches = await this.prisma.beach.findMany({
      where: {
        publicationStatus: PublicationStatus.PUBLISHED,
        profile: { isNot: null },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        coastalLocation: {
          select: {
            slug: true,
            name: true,
            images: {
              where: { isCover: true },
              select: {
                url: true,
                alt: true,
                title: true,
                author: true,
                license: true,
                licenseUrl: true,
                sourceUrl: true,
              },
              take: 1,
            },
          },
        },
        latitude: true,
        longitude: true,
        profile: {
          select: { surface: true, childSuitability: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return beaches.map((beach) => {
      if (!beach.profile) {
        throw new Error(`Published candidate ${beach.id} has no profile`);
      }

      return {
        id: beach.id,
        slug: beach.slug,
        name: beach.name,
        coastalLocation: beach.coastalLocation
          ? {
              slug: beach.coastalLocation.slug,
              name: beach.coastalLocation.name,
              coverImage: beach.coastalLocation.images[0] ?? null,
            }
          : null,
        latitude: beach.latitude.toNumber(),
        longitude: beach.longitude.toNumber(),
        surface: beach.profile.surface,
        childSuitability: beach.profile.childSuitability,
      };
    });
  }
}
