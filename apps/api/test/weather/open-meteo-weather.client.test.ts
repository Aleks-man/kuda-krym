import { describe, expect, it, vi } from "vitest";

import { OpenMeteoWeatherClient } from "../../src/modules/weather/open-meteo/open-meteo-weather.client.js";

const validResponse = {
  latitude: 44.65,
  longitude: 33.53,
  timezone: "GMT",
  hourly: {
    time: ["2026-08-20T10:00", "2026-08-20T11:00"],
    temperature_2m: [27.1, 27.8],
    precipitation_probability: [5, 10],
    precipitation: [0, 0.1],
    wind_speed_10m: [3.2, 3.8],
    wind_direction_10m: [240, 245],
    wind_gusts_10m: [5.1, 5.8],
    cloud_cover: [12, 18],
  },
};

describe("OpenMeteoWeatherClient", () => {
  it("requests and maps an hourly forecast", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify(validResponse), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const client = new OpenMeteoWeatherClient({
      fetch: fetchMock,
      now: () => new Date("2026-08-20T08:00:00.000Z"),
    });

    const forecast = await client.getForecast({
      location: { latitude: 44.65, longitude: 33.53 },
      days: 2,
    });

    const requestedUrl = fetchMock.mock.calls[0]?.[0] as URL;
    expect(requestedUrl.searchParams.get("forecast_days")).toBe("2");
    expect(requestedUrl.searchParams.get("wind_speed_unit")).toBe("ms");
    expect(forecast.generatedAt).toBe("2026-08-20T08:00:00.000Z");
    expect(forecast.hourly[0]).toMatchObject({
      temperatureCelsius: 27.1,
      windSpeedMetersPerSecond: 3.2,
      cloudCoverPercent: 12,
    });
  });

  it("rejects inconsistent hourly arrays", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...validResponse,
          hourly: { ...validResponse.hourly, cloud_cover: [12] },
        }),
        { status: 200 },
      ),
    );
    const client = new OpenMeteoWeatherClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        location: { latitude: 44.65, longitude: 33.53 },
        days: 1,
      }),
    ).rejects.toThrow("inconsistent hourly field: cloud_cover");
  });

  it("reports an upstream HTTP error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));
    const client = new OpenMeteoWeatherClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        location: { latitude: 44.65, longitude: 33.53 },
        days: 1,
      }),
    ).rejects.toThrow("Open-Meteo returned status 503");
  });
});
