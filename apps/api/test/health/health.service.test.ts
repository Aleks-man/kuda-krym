import { describe, expect, it, vi } from "vitest";

import { HealthService } from "../../src/modules/health/health.service.js";

describe("HealthService", () => {
  it("reports a healthy database", async () => {
    const service = new HealthService({ ping: vi.fn().mockResolvedValue(undefined) });

    await expect(service.getReadiness()).resolves.toEqual({
      status: "ready",
      checks: { database: "up" },
    });
  });

  it("hides database errors and reports not ready", async () => {
    const service = new HealthService({
      ping: vi.fn().mockRejectedValue(new Error("password leaked")),
    });

    await expect(service.getReadiness()).resolves.toEqual({
      status: "not_ready",
      checks: { database: "down" },
    });
  });
});
