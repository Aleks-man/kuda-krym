import { PublicationStatus, type PrismaClient } from "@kuda-krym/database";
import type {
  RoutingBeach,
  RoutingBeachRepository,
} from "./routing-beach.repository.js";

export class PrismaRoutingBeachRepository implements RoutingBeachRepository {
  public constructor(private readonly prisma: PrismaClient) {}

  public async findPublishedById(id: string): Promise<RoutingBeach | null> {
    const beach = await this.prisma.beach.findFirst({
      where: { id, publicationStatus: PublicationStatus.PUBLISHED },
      select: { id: true, latitude: true, longitude: true },
    });

    if (!beach) return null;

    return {
      id: beach.id,
      latitude: beach.latitude.toNumber(),
      longitude: beach.longitude.toNumber(),
    };
  }
}
