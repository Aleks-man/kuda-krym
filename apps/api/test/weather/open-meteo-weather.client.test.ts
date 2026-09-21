import { describe, expect, it, vi } from "vitest";

import { OpenMeteoWeatherClient } from "../../src/modules/weather/open-meteo/open-meteo-weather.client.js";

const validResponse = {
  latitude: 44.65,
  longitude: 33.53,
  timezone: "GMT",
  daily: {
    time: ["2026-08-20", "2026-08-21"],
    sunrise: ["2026-08-20T02:45", "2026-08-21T02:46"],
    sunset: ["2026-08-20T16:42", "2026-08-21T16:40"],
  },
  hourly: {
    time: ["2026-08-20T10:00", "2026-08-20T11:00"],
    temperature_2m: [27.1, 27.8],
    apparent_temperature: [29.3, 30.1],
    relative_humidity_2m: [65, 70],
    uv_index: [4.2, 5.1],
    surface_pressure: [1013.25, 1000],
    visibility: [24000, 500],
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
    expect(requestedUrl.searchParams.get("daily")).toBe("sunrise,sunset");
    expect(requestedUrl.searchParams.get("hourly")?.split(",")).toContain("apparent_temperature");
    expect(requestedUrl.searchParams.get("hourly")?.split(",")).toContain("relative_humidity_2m");
    expect(requestedUrl.searchParams.get("hourly")?.split(",")).toContain("uv_index");
    expect(requestedUrl.searchParams.get("hourly")?.split(",")).toEqual(expect.arrayContaining(["surface_pressure", "visibility"]));
    expect(forecast.generatedAt).toBe("2026-08-20T08:00:00.000Z");
    expect(forecast.hourly[0]).toMatchObject({
      temperatureCelsius: 27.1,
      apparentTemperatureCelsius: 29.3,
      relativeHumidityPercent: 65,
      uvIndex: 4.2,
      surfacePressureHpa: 1013.25,
      visibilityMeters: 24000,
      windSpeedMetersPerSecond: 3.2,
      windGustMetersPerSecond: 5.1,
      cloudCoverPercent: 12,
    });
    expect(forecast.sunTimes?.[0]).toEqual({
      date: "2026-08-20",
      sunrise: "2026-08-20T02:45",
      sunset: "2026-08-20T16:42",
    });
  });

  it.each([
    { values: undefined, expected: [null, null] },
    { values: [null, null], expected: [null, null] },
    { values: [-7.2, 0], expected: [-7.2, 0] },
  ])("maps apparent temperature without inventing missing values: $values", async ({ values, expected }) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, apparent_temperature: values } })),
    );
    const forecast = await new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    });
    expect(forecast.hourly.map(hour => hour.apparentTemperatureCelsius)).toEqual(expected);
  });

  it("rejects inconsistent apparent temperature arrays", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, apparent_temperature: [29.3] } })),
    );
    await expect(new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    })).rejects.toThrow("inconsistent hourly field: apparent_temperature");
  });

  it.each([
    { values: undefined, expected: [null, null] },
    { values: [null, null], expected: [null, null] },
    { values: [0, 100], expected: [0, 100] },
  ])("maps humidity and handles missing values: $values", async ({ values, expected }) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, relative_humidity_2m: values } })),
    );
    const forecast = await new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    });
    expect(forecast.hourly.map(hour => hour.relativeHumidityPercent)).toEqual(expected);
  });

  it.each([[-1, 65], [101, 65], [65]])("rejects invalid humidity data: %j", async (...values) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, relative_humidity_2m: values } })),
    );
    await expect(new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    })).rejects.toThrow();
  });

  it.each([
    { values: undefined, expected: [null, null] },
    { values: [null, null], expected: [null, null] },
    { values: [0, 15.5], expected: [0, 15.5] },
  ])("maps UV index without replacing missing values with zero: $values", async ({ values, expected }) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, uv_index: values } })),
    );
    const forecast = await new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    });
    expect(forecast.hourly.map(hour => hour.uvIndex)).toEqual(expected);
  });

  it.each([
    { values: [-1, 4] },
    { values: ["4", 5] },
    { values: [4] },
  ])("rejects invalid UV data: $values", async ({ values }) => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ...validResponse, hourly: { ...validResponse.hourly, uv_index: values } })),
    );
    await expect(new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
      location: { latitude: 44.65, longitude: 33.53 }, days: 2,
    })).rejects.toThrow();
  });

  it.each(["surface_pressure", "visibility"] as const)("handles missing and rejects malformed %s arrays", async (field) => {
    const resultField = field === "surface_pressure" ? "surfacePressureHpa" : "visibilityMeters";
    for (const values of [undefined, [null, null]]) {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
        ...validResponse, hourly: { ...validResponse.hourly, [field]: values },
      })));
      const forecast = await new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
        location: { latitude: 44.65, longitude: 33.53 }, days: 2,
      });
      expect(forecast.hourly.map(hour => hour[resultField])).toEqual([null, null]);
    }
    for (const values of [[-1, 1], ["1000", 1], [1000]]) {
      const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({
        ...validResponse, hourly: { ...validResponse.hourly, [field]: values },
      })));
      await expect(new OpenMeteoWeatherClient({ fetch: fetchMock }).getForecast({
        location: { latitude: 44.65, longitude: 33.53 }, days: 2,
      })).rejects.toThrow();
    }
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

  it("rejects inconsistent daily sun times", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          ...validResponse,
          daily: { ...validResponse.daily, sunset: ["2026-08-20T16:42"] },
        }),
        { status: 200 },
      ),
    );
    const client = new OpenMeteoWeatherClient({ fetch: fetchMock });

    await expect(
      client.getForecast({
        location: { latitude: 44.65, longitude: 33.53 },
        days: 2,
      }),
    ).rejects.toThrow("inconsistent daily sun times");
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
