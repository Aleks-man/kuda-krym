import { beachForecastSchema, coastalForecastSchema } from "@kuda-krym/contracts";
import { describe, expect, it, vi } from "vitest";
import { BeachForecastService } from "../src/modules/forecast/beach-forecast.service.js";
import { CoastalForecastService } from "../src/modules/coastal-forecast/coastal-forecast.service.js";

const coordinates = { latitude: 44.495, longitude: 34.166 };
const id = "47f72fb6-dd75-4ca2-9f78-ad1e594dbcb4";
const generatedAt = "2026-09-21T08:00:00.000Z";
const hour = {
  time: "2026-09-21T09:00", temperatureCelsius: 24, precipitationProbabilityPercent: 0,
  precipitationMillimeters: 0, windSpeedMetersPerSecond: 2, windDirectionDegrees: 180,
  windGustMetersPerSecond: 3, cloudCoverPercent: 10,
};
const weather = { location: coordinates, timezone: "UTC", generatedAt, hourly: [hour] } as const;

describe.each(["beach", "coast"] as const)("%s forecast during a marine outage", (kind) => {
  function setup() {
    const error = new Error("Marine request timed out");
    const getForecast = vi.fn().mockRejectedValue(error);
    const getWeather = vi.fn().mockResolvedValue({ ...weather, hourly: [hour] });
    const onMarineError = vi.fn();
    const dependencies = {
      weatherProvider: { getForecast: getWeather }, marineProvider: { getForecast }, onMarineError,
      modelComparisonService: { compare: vi.fn().mockResolvedValue({
        location: coordinates, generatedAt, freshness: null,
        models: { available: [], failures: [] }, hourly: [],
      }) },
      now: () => new Date(generatedAt),
    };
    const service = kind === "beach" ? new BeachForecastService({
      ...dependencies,
      beachRepository: { findPublishedById: async () => ({ id, slug: "yalta", name: "Yalta", ...coordinates }) },
    }) : new CoastalForecastService({
      ...dependencies,
      locationRepository: {
        findPublished: async () => [],
        findPublishedBySlug: async () => ({
          id, slug: "yalta", name: "Yalta", region: "SOUTH_COAST", waterBody: "BLACK_SEA",
          weatherCoordinates: coordinates, marineCoordinates: coordinates, coverImage: null,
        }),
      },
    });
    return { service, getForecast, getWeather, onMarineError, error };
  }

  it("preserves weather, marks marine unavailable, and recovers on a subsequent request", async () => {
    const { service, getForecast, onMarineError, error } = setup();
    const result = await service.getForecast(id, 3);
    (kind === "beach" ? beachForecastSchema : coastalForecastSchema).parse(result);
    expect(result?.hourly[0]?.weather.temperatureCelsius).toBe(24);
    expect(result?.freshness.sources.marine).toBeNull();
    expect(result?.hourly[0]?.marine).toEqual({
      seaSurfaceTemperatureCelsius: null, waveHeightMeters: null,
      waveDirectionDegrees: null, wavePeriodSeconds: null,
    });
    expect(result?.hourly[0]?.scores.sea.coveragePercent).toBeLessThan(100);
    expect(onMarineError).toHaveBeenCalledWith(error);
    getForecast.mockResolvedValue({
      location: coordinates, timezone: "UTC", generatedAt,
      hourly: [{ time: hour.time, seaSurfaceTemperatureCelsius: 22, waveHeightMeters: 0.3, waveDirectionDegrees: 180, wavePeriodSeconds: 4 }],
    });
    const recovered = await service.getForecast(id, 3);
    expect(recovered?.hourly[0]?.marine.waveHeightMeters).toBe(0.3);
    expect(recovered?.freshness.sources.marine?.status).toBe("FRESH");
  });

  it("does not fabricate weather when both providers fail", async () => {
    const { service, getWeather } = setup();
    getWeather.mockRejectedValue(new Error("Weather unavailable"));
    await expect(service.getForecast(id, 3)).rejects.toThrow("Weather unavailable");
  });
});
