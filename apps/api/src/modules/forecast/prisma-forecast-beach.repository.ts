import { PublicationStatus, type PrismaClient } from "@kuda-krym/database";

import type {
  ForecastBeach,
  ForecastBeachRepository,
} from "./forecast-beach.repository.js";

export class PrismaForecastBeachRepository
  implements ForecastBeachRepository
{
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublishedById(id: string): Promise<ForecastBeach | null> {
    const beach = await this.prisma.beach.findFirst({
      where: { id, publicationStatus: PublicationStatus.PUBLISHED },
      select: {
        id: true,
        slug: true,
        name: true,
        latitude: true,
        longitude: true,
      },
    });

    if (!beach) return null;

    return {
      id: beach.id,
      slug: beach.slug,
      name: beach.name,
      latitude: beach.latitude.toNumber(),
      longitude: beach.longitude.toNumber(),
    };
  }
}
