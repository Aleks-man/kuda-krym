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
        latitude: beach.latitude.toNumber(),
        longitude: beach.longitude.toNumber(),
        surface: beach.profile.surface,
        childSuitability: beach.profile.childSuitability,
      };
    });
  }
}
