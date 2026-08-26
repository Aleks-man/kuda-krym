import { describe, expect, it } from "vitest";

import { calculateWeatherModelAgreement } from "../../src/modules/weather/models/agreement/calculate-weather-model-agreement.js";
import type { AlignedWeatherModelHour } from "../../src/modules/weather/models/comparison/weather-model-alignment.js";
import type { WeatherModel } from "../../src/modules/weather/models/model-weather-forecast.js";

describe("calculateWeatherModelAgreement", () => {
  it("returns full agreement for identical model values", () => {
    const result = calculateWeatherModelAgreement(
      createHour(["ECMWF_IFS", "DWD_ICON", "NOAA_GFS"]),
    );

    expect(result).toMatchObject({ score: 100, level: "HIGH", modelCount: 3 });
    expect(result.factors).toHaveLength(6);
  });

  it("returns low agreement for strongly divergent values", () => {
    const hour = createHour(["ECMWF_IFS", "DWD_ICON"]);
    hour.samples[1] = {
      ...hour.samples[1]!,
      conditions: {
        temperatureCelsius: 30,
        precipitationMillimeters: 3,
        windSpeedMetersPerSecond: 9,
        windDirectionDegrees: 180,
        windGustMetersPerSecond: 15,
        cloudCoverPercent: 100,
      },
    };

    const result = calculateWeatherModelAgreement(hour);

    expect(result.score).toBe(0);
    expect(result.level).toBe("LOW");
  });

  it("does not infer agreement from a single model", () => {
    expect(calculateWeatherModelAgreement(createHour(["ECMWF_IFS"]))).toEqual({
      time: "2026-08-26T10:00",
      modelCount: 1,
      score: null,
      level: "INSUFFICIENT_DATA",
      factors: [],
    });
  });

  it("scores wind directions across north by their shortest spread", () => {
    const hour = createHour(["ECMWF_IFS", "DWD_ICON", "NOAA_GFS"]);
    [350, 10, 5].forEach((windDirectionDegrees, index) => {
      const sample = hour.samples[index]!;
      hour.samples[index] = {
        ...sample,
        conditions: { ...sample.conditions, windDirectionDegrees },
      };
    });

    const result = calculateWeatherModelAgreement(hour);
    const direction = result.factors.find(
      (factor) => factor.name === "WIND_DIRECTION",
    );

    expect(direction).toMatchObject({ spread: 20, score: 90 });
  });
});

function createHour(models: WeatherModel[]): AlignedWeatherModelHour {
  return {
    time: "2026-08-26T10:00",
    samples: models.map((model) => ({
      model,
      generatedAt: "2026-08-26T08:00:00.000Z",
      conditions: {
        temperatureCelsius: 24,
        precipitationMillimeters: 0,
        windSpeedMetersPerSecond: 3,
        windDirectionDegrees: 0,
        windGustMetersPerSecond: 5,
        cloudCoverPercent: 20,
      },
    })),
  };
}
