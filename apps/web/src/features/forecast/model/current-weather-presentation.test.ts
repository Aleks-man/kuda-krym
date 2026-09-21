import { describe, expect, it } from "vitest";
import type { ForecastHour } from "@kuda-krym/contracts";
import { getCurrentWeatherPresentation, selectCurrentForecastHour } from "./current-weather-presentation";

describe("current weather presentation", () => {
  it.each([
    [82, "Сильный ливень"], [65, "Сильный дождь"], [61, "Небольшой дождь"],
    [95, "Гроза"], [99, "Гроза с градом"], [75, "Сильный снег"], [45, "Туман"], [51, "Морось"],
  ])("uses WMO code %s ahead of cloud cover", (weatherCode, label) => {
    expect(getCurrentWeatherPresentation({ weatherCode, cloudCoverPercent: 10, precipitationMillimeters: 0 }, false).label).toBe(label);
  });
  it("shows precipitation without calling it cloudiness when the code is missing", () => {
    expect(getCurrentWeatherPresentation({ cloudCoverPercent: 100, precipitationMillimeters: 0.1 }, false).label).toBe("Осадки");
  });
  it("uses day/night for clear sky and cloud cover for old responses", () => {
    expect(getCurrentWeatherPresentation({ weatherCode: 0, cloudCoverPercent: 0, precipitationMillimeters: 0 }, true).variant).toBe("clear-night");
    expect(getCurrentWeatherPresentation({ cloudCoverPercent: 100, precipitationMillimeters: 0 }, false).label).toBe("Облачно");
  });
  it("uses the current hourly interval instead of the next hour for fallback and marine data", () => {
    const hours = [{ time: "2026-09-21T10:00" }, { time: "2026-09-21T11:00" }] as ForecastHour[];
    expect(selectCurrentForecastHour(hours, new Date("2026-09-21T10:45Z"))).toBe(hours[0]);
  });
});
