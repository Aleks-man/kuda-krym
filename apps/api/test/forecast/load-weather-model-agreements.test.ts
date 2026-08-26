import { describe, expect, it, vi } from "vitest";

import { loadWeatherModelAgreements } from "../../src/modules/forecast/load-weather-model-agreements.js";

const location = { latitude: 44.495, longitude: 34.166 } as const;

describe("loadWeatherModelAgreements", () => {
  it("extracts agreement scores by forecast hour", async () => {
    const compare = vi.fn().mockResolvedValue({
      location,
      generatedAt: "2026-08-26T08:00:00.000Z",
      models: { available: [], failures: [] },
      hourly: [
        {
          time: "2026-08-26T10:00",
          samples: [],
          agreement: {
            modelCount: 3,
            score: 88,
            level: "HIGH",
            factors: [],
          },
        },
      ],
    });

    await expect(
      loadWeatherModelAgreements({ compare }, location, 2),
    ).resolves.toEqual([{ time: "2026-08-26T10:00", score: 88 }]);
    expect(compare).toHaveBeenCalledWith(location, 2);
  });

  it("does not fail the primary forecast when comparison throws", async () => {
    const compare = vi.fn().mockRejectedValue(new Error("comparison failed"));

    await expect(
      loadWeatherModelAgreements({ compare }, location, 1),
    ).resolves.toEqual([]);
  });
});
