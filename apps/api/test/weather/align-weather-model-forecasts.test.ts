import { describe, expect, it } from "vitest";

import { alignWeatherModelForecasts } from "../../src/modules/weather/models/comparison/align-weather-model-forecasts.js";
import type {
  HourlyModelWeather,
  ModelWeatherForecast,
  WeatherModel,
} from "../../src/modules/weather/models/model-weather-forecast.js";

describe("alignWeatherModelForecasts", () => {
  it("aligns models by hour in chronological and stable model order", () => {
    const forecasts = [
      createForecast("NOAA_GFS", [createHour("2026-08-26T11:00", 25)]),
      createForecast("ECMWF_IFS", [
        createHour("2026-08-26T10:00", 24),
        createHour("2026-08-26T11:00", 26),
      ]),
      createForecast("DWD_ICON", [createHour("2026-08-26T10:00", 23)]),
    ];

    const result = alignWeatherModelForecasts(forecasts);

    expect(result.map(({ time }) => time)).toEqual([
      "2026-08-26T10:00",
      "2026-08-26T11:00",
    ]);
    expect(result[0]?.samples.map(({ model }) => model)).toEqual([
      "ECMWF_IFS",
      "DWD_ICON",
    ]);
    expect(result[1]?.samples.map(({ model }) => model)).toEqual([
      "ECMWF_IFS",
      "NOAA_GFS",
    ]);
    expect(result[1]?.samples[0]?.conditions.temperatureCelsius).toBe(26);
  });

  it("returns an empty alignment for no available forecasts", () => {
    expect(alignWeatherModelForecasts([])).toEqual([]);
  });

  it("rejects duplicate forecasts for the same model", () => {
    expect(() =>
      alignWeatherModelForecasts([
        createForecast("ECMWF_IFS", []),
        createForecast("ECMWF_IFS", []),
      ]),
    ).toThrow("Duplicate weather model forecast: ECMWF_IFS");
  });

  it("rejects duplicate hours inside one model forecast", () => {
    const duplicateHour = createHour("2026-08-26T10:00", 24);

    expect(() =>
      alignWeatherModelForecasts([
        createForecast("DWD_ICON", [duplicateHour, duplicateHour]),
      ]),
    ).toThrow("Duplicate DWD_ICON forecast hour: 2026-08-26T10:00");
  });
});

function createForecast(
  model: WeatherModel,
  hourly: HourlyModelWeather[],
): ModelWeatherForecast {
  return {
    model,
    location: { latitude: 44.495, longitude: 34.166 },
    timezone: "UTC",
    generatedAt: "2026-08-26T08:00:00.000Z",
    hourly,
  };
}

function createHour(time: string, temperatureCelsius: number): HourlyModelWeather {
  return {
    time,
    temperatureCelsius,
    precipitationMillimeters: 0,
    windSpeedMetersPerSecond: 3,
    windDirectionDegrees: 240,
    windGustMetersPerSecond: 5,
    cloudCoverPercent: 20,
  };
}
