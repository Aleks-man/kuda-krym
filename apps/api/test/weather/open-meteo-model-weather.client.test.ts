import { describe, expect, it, vi } from "vitest";

import { OpenMeteoModelWeatherClient } from "../../src/modules/weather/models/open-meteo/open-meteo-model-weather.client.js";
import type { WeatherModel } from "../../src/modules/weather/models/model-weather-forecast.js";

const validResponse = {
  latitude: 44.65,
  longitude: 33.53,
  timezone: "GMT",
  hourly: {
    time: ["2026-08-20T10:00"],
    temperature_2m: [27.1],
    precipitation: [0.1],
    wind_speed_10m: [3.2],
    wind_direction_10m: [240],
    wind_gusts_10m: [5.1],
    cloud_cover: [12],
  },
};

const expectedPaths: Record<WeatherModel, string> = {
  ECMWF_IFS: "/v1/ecmwf",
  DWD_ICON: "/v1/dwd-icon",
  NOAA_GFS: "/v1/gfs",
};

describe("OpenMeteoModelWeatherClient", () => {
  it.each(Object.entries(expectedPaths) as [WeatherModel, string][])(
    "requests the dedicated %s endpoint",
    async (model, expectedPath) => {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
        new Response(JSON.stringify(validResponse), { status: 200 }),
      );
      const client = new OpenMeteoModelWeatherClient({
        fetch: fetchMock,
        now: () => new Date("2026-08-20T08:00:00.000Z"),
      });

      const forecast = await client.getForecast({
        model,
        location: { latitude: 44.65, longitude: 33.53 },
        days: 2,
      });

      const requestedUrl = fetchMock.mock.calls[0]?.[0] as URL;
      expect(requestedUrl.pathname).toBe(expectedPath);
      expect(requestedUrl.searchParams.get("forecast_days")).toBe("2");
      expect(requestedUrl.searchParams.get("hourly")).not.toContain(
        "precipitation_probability",
      );
      expect(forecast).toMatchObject({
        model,
        generatedAt: "2026-08-20T08:00:00.000Z",
        hourly: [{ temperatureCelsius: 27.1, windSpeedMetersPerSecond: 3.2 }],
      });
    },
  );

  it("rejects inconsistent model arrays", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...validResponse,
          hourly: { ...validResponse.hourly, cloud_cover: [] },
        }),
        { status: 200 },
      ),
    );
    const client = new OpenMeteoModelWeatherClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        model: "ECMWF_IFS",
        location: { latitude: 44.65, longitude: 33.53 },
        days: 1,
      }),
    ).rejects.toThrow("ECMWF_IFS returned inconsistent hourly field");
  });

  it("reports the failed model in an upstream error", async () => {
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockResolvedValue(new Response(null, { status: 503 }));
    const client = new OpenMeteoModelWeatherClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        model: "DWD_ICON",
        location: { latitude: 44.65, longitude: 33.53 },
        days: 1,
      }),
    ).rejects.toThrow("Open-Meteo DWD_ICON returned status 503");
  });
});
