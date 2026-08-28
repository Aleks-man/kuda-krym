import type { ReadinessResponse } from "@kuda-krym/contracts";

import type { DatabaseHealthProbe } from "./database-health.probe.js";

export class HealthService {
  constructor(private readonly database: DatabaseHealthProbe) {}

  async getReadiness(): Promise<ReadinessResponse> {
    try {
      await this.database.ping();
      return { status: "ready", checks: { database: "up" } };
    } catch {
      return { status: "not_ready", checks: { database: "down" } };
    }
  }
}
