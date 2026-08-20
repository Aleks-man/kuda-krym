import { describe, expect, it, vi } from "vitest";

import { OpenMeteoMarineClient } from "../../src/modules/marine/open-meteo/open-meteo-marine.client.js";

const validResponse = {
  latitude: 44.625,
  longitude: 33.54167,
  timezone: "GMT",
  hourly: {
    time: ["2026-08-20T10:00", "2026-08-20T11:00"],
    sea_surface_temperature: [25.6, null],
    wave_height: [0.32, 0.34],
    wave_direction: [225, 228],
    wave_period: [3.8, 4.1],
  },
};

describe("OpenMeteoMarineClient", () => {
  it("requests and maps hourly marine conditions", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(validResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const client = new OpenMeteoMarineClient({
      fetch: fetchMock,
      now: () => new Date("2026-08-20T08:00:00.000Z"),
    });

    const forecast = await client.getForecast({
      location: { latitude: 44.644844, longitude: 33.536119 },
      days: 2,
    });

    const requestedUrl = fetchMock.mock.calls[0]?.[0] as URL;
    expect(requestedUrl.searchParams.get("forecast_days")).toBe("2");
    expect(requestedUrl.searchParams.get("cell_selection")).toBe("sea");
    expect(forecast.location).toEqual({
      latitude: 44.625,
      longitude: 33.54167,
    });
    expect(forecast.hourly[0]).toMatchObject({
      seaSurfaceTemperatureCelsius: 25.6,
      waveHeightMeters: 0.32,
      waveDirectionDegrees: 225,
      wavePeriodSeconds: 3.8,
    });
    expect(forecast.hourly[1]?.seaSurfaceTemperatureCelsius).toBeNull();
  });

  it("rejects inconsistent hourly arrays", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...validResponse,
          hourly: { ...validResponse.hourly, wave_period: [3.8] },
        }),
        { status: 200 },
      ),
    );
    const client = new OpenMeteoMarineClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        location: { latitude: 44.644844, longitude: 33.536119 },
        days: 1,
      }),
    ).rejects.toThrow("inconsistent hourly field: wave_period");
  });

  it("reports an upstream HTTP error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));
    const client = new OpenMeteoMarineClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        location: { latitude: 44.644844, longitude: 33.536119 },
        days: 1,
      }),
    ).rejects.toThrow("Open-Meteo Marine returned status 503");
  });
});
