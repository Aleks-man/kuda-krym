import { describe, expect, it } from "vitest";
import { formatPressure, formatVisibility, getUvRisk } from "./weather-details";

describe("current weather details", () => {
  it.each([
    [undefined, "—"], [null, "—"], [0, "0 м"], [500, "500 м"],
    [999, "999 м"], [1000, "1 км"], [1500, "1,5 км"], [24000, "24 км"],
  ])("formats visibility %s with appropriate units", (value, expected) => {
    expect(formatVisibility(value)).toBe(expected);
  });
  it("converts surface pressure from hPa to mmHg without inventing missing values", () => {
    expect(formatPressure(1013.25)).toBe("760 мм рт. ст.");
    expect(formatPressure(1000)).toBe("750 мм рт. ст.");
    expect(formatPressure(null)).toBe("—");
    expect(formatPressure(undefined)).toBe("—");
  });
  it.each([
    [null, null], [undefined, null], [0, "Низкий"], [2.9, "Низкий"],
    [3, "Умеренный"], [5.9, "Умеренный"], [6, "Высокий"], [7.9, "Высокий"],
    [8, "Очень высокий"], [10.9, "Очень высокий"], [11, "Экстремальный"], [15, "Экстремальный"],
  ])("classifies UV %s at exposure boundaries", (value, expected) => {
    expect(getUvRisk(value)).toBe(expected);
  });
});
