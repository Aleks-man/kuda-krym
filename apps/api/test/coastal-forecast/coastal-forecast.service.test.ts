import { describe, expect, it, vi } from "vitest";

import { CoastalForecastService } from "../../src/modules/coastal-forecast/coastal-forecast.service.js";

const location = {
  id: "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4",
  slug: "yalta",
  name: "Ялта",
  region: "SOUTH_COAST",
  waterBody: "BLACK_SEA",
  weatherCoordinates: { latitude: 44.495, longitude: 34.166 },
  marineCoordinates: { latitude: 44.46, longitude: 34.17 },
} as const;

describe("CoastalForecastService", () => {
  it("requests weather and marine data at their dedicated coordinates", async () => {
    const getWeatherForecast = vi.fn().mockResolvedValue({
      location: location.weatherCoordinates,
      timezone: "UTC",
      generatedAt: "2026-08-20T08:00:00.000Z",
      hourly: [],
    });
    const getMarineForecast = vi.fn().mockResolvedValue({
      location: location.marineCoordinates,
      timezone: "UTC",
      generatedAt: "2026-08-20T08:00:00.000Z",
      hourly: [],
    });
    const service = new CoastalForecastService({
      locationRepository: {
        findPublished: async () => [location],
        findPublishedBySlug: async () => location,
      },
      weatherProvider: { getForecast: getWeatherForecast },
      marineProvider: { getForecast: getMarineForecast },
    });

    await service.getForecast("yalta", 2);

    expect(getWeatherForecast).toHaveBeenCalledWith({
      location: location.weatherCoordinates,
      days: 2,
    });
    expect(getMarineForecast).toHaveBeenCalledWith({
      location: location.marineCoordinates,
      days: 2,
    });
  });
});
