import type { ForecastHour } from "@kuda-krym/contracts";
import { describe, expect, it } from "vitest";
import { summarizeForecastDays } from "./daily-forecast";
function hour(time: string, temperature = 20, water: number | null = null, wave: number | null = null): ForecastHour {
  return { time, weather: { temperatureCelsius: temperature, precipitationMillimeters: 0.2, windSpeedMetersPerSecond: temperature / 2 }, marine: { seaSurfaceTemperatureCelsius: water, waveHeightMeters: wave } } as ForecastHour;
}
describe("daily forecast summary", () => {
  it("uses Moscow calendar days and all hours, including hours omitted by the chart", () => {
    const now = new Date("2026-09-23T06:00:00Z");
    const days = summarizeForecastDays([
      hour("2026-09-22T20:00", -10),
      hour("2026-09-23T01:00", 10, 20, 0.1),
      hour("2026-09-23T02:00", 31, null, 1.4),
      hour("2026-09-23T21:00", 15, 22),
      hour("2026-09-29T20:00", 21),
      hour("2026-09-29T21:00", 99),
    ], now);
    expect(days.map(day => day.dateKey)).toEqual(["2026-09-23", "2026-09-24", "2026-09-29"]);
    expect(days[0]).toMatchObject({ minTemperature: 10, maxTemperature: 31, precipitation: 0.4, maxWind: 15.5, waterTemperature: 20, maxWave: 1.4 });
    expect(days[0].label).toContain("Сегодня");
    expect(days[1].label).toContain("Завтра");
  });
  it("preserves missing marine data and zero values", () => {
    const now = new Date("2026-09-23T06:00:00Z");
    expect(summarizeForecastDays([hour("2026-09-23T09:00")], now)[0]).toMatchObject({ waterTemperature: null, maxWave: null });
    expect(summarizeForecastDays([hour("2026-09-23T09:00", 0, 0, 0)], now)[0]).toMatchObject({ minTemperature: 0, waterTemperature: 0, maxWave: 0 });
  });
  it("does not present an expired forecast as today or tomorrow", () => {
    expect(summarizeForecastDays([hour("2026-09-21T09:00")], new Date("2026-09-23T06:00:00Z"))).toEqual([]);
  });
  it("averages only available water values and sorts dates", () => {
    const result = summarizeForecastDays([hour("2026-09-24T09:00"), hour("2026-09-23T09:00", 20, 20), hour("2026-09-23T10:00", 20, 24), hour("2026-09-23T11:00")], new Date("2026-09-23T06:00:00Z"));
    expect(result[0].waterTemperature).toBe(22);
    expect(result[0].dateKey).toBe("2026-09-23");
  });
});
