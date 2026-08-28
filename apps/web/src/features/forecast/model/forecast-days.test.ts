import type { ForecastHour } from "@kuda-krym/contracts";
import { describe, expect, it } from "vitest";

import { selectForecastDays } from "./forecast-days";

describe("selectForecastDays", () => {
  it("groups upcoming hours by calendar day in Crimea", () => {
    const result = selectForecastDays(
      hours(
        "2026-08-28T19:00",
        "2026-08-28T20:00",
        "2026-08-28T21:00",
        "2026-08-29T08:00",
      ),
      new Date("2026-08-28T19:30:00Z"),
    );

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      dateKey: "2026-08-28",
      label: "Сегодня, 28 августа",
    });
    expect(result[0]?.hours.map(({ time }) => time)).toEqual([
      "2026-08-28T20:00",
    ]);
    expect(result[1]).toMatchObject({
      dateKey: "2026-08-29",
      label: "Завтра, 29 августа",
    });
  });

  it("returns no more than two days and eight evenly spaced hours per day", () => {
    const firstDay = Array.from(
      { length: 24 },
      (_, hour) => `2026-08-28T${hour.toString().padStart(2, "0")}:00`,
    );
    const result = selectForecastDays(
      hours(...firstDay, "2026-08-29T12:00", "2026-08-30T12:00"),
      new Date("2026-08-28T00:00:00Z"),
    );

    expect(result).toHaveLength(2);
    expect(result[0]?.hours).toHaveLength(8);
    expect(result[0]?.hours[0]?.time).toBe("2026-08-28T00:00");
    expect(result[0]?.hours.at(-1)?.time).toBe("2026-08-28T20:00");
  });

  it("falls back to supplied hours when the whole forecast is in the past", () => {
    const result = selectForecastDays(
      hours("2026-08-28T08:00", "2026-08-28T09:00"),
      new Date("2026-08-30T00:00:00Z"),
    );

    expect(result[0]?.hours).toHaveLength(2);
  });
});

function hours(...times: string[]): ForecastHour[] {
  return times.map((time) => ({ time }) as ForecastHour);
}
