import type { PrismaClient } from "@kuda-krym/database";

import type { DatabaseHealthProbe } from "./database-health.probe.js";

export class PrismaDatabaseHealthProbe implements DatabaseHealthProbe {
  constructor(private readonly prisma: PrismaClient) {}

  async ping(): Promise<void> {
    await this.prisma.$queryRaw`SELECT 1`;
  }
}
