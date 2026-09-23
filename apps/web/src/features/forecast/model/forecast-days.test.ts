import type { ForecastHour } from "@kuda-krym/contracts";
import { describe, expect, it } from "vitest";

import { formatForecastDateOption, selectForecastDays } from "./forecast-days";

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
      label: "Сегодня, 28 августа (пятница)",
    });
    expect(result[0]?.hours.map(({ time }) => time)).toEqual([
      "2026-08-28T20:00",
    ]);
    expect(result[1]).toMatchObject({
      dateKey: "2026-08-29",
      label: "Завтра, 29 августа (суббота)",
    });
  });

  it("shows the nearest six hours and then every two hours today", () => {
    const firstDay = dayHours("2026-08-28");
    const result = selectForecastDays(
      hours(...firstDay, "2026-08-29T11:00", "2026-08-30T11:00"),
      new Date("2026-08-28T00:00:00Z"),
    );

    expect(result).toHaveLength(3);
    expect(result[0]?.hours.map(({ time }) => time)).toEqual([
      "2026-08-28T00:00",
      "2026-08-28T01:00",
      "2026-08-28T02:00",
      "2026-08-28T03:00",
      "2026-08-28T04:00",
      "2026-08-28T05:00",
      "2026-08-28T07:00",
      "2026-08-28T09:00",
      "2026-08-28T11:00",
      "2026-08-28T13:00",
      "2026-08-28T15:00",
      "2026-08-28T17:00",
      "2026-08-28T19:00",
    ]);
  });

  it("shows future days around the clock every two hours in Crimea time", () => {
    const result = selectForecastDays(
      hours(...dayHours("2026-08-28"), ...dayHours("2026-08-29")),
      new Date("2026-08-28T18:00:00Z"),
    );

    expect(result[1]?.hours.map(({ time }) => time)).toEqual([
      "2026-08-28T21:00",
      "2026-08-28T22:00",
      "2026-08-28T23:00",
      "2026-08-29T01:00",
      "2026-08-29T03:00",
      "2026-08-29T05:00",
      "2026-08-29T07:00",
      "2026-08-29T09:00",
      "2026-08-29T11:00",
      "2026-08-29T13:00",
      "2026-08-29T15:00",
      "2026-08-29T17:00",
      "2026-08-29T19:00",
    ]);
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

function dayHours(date: string): string[] {
  return Array.from(
    { length: 24 },
    (_, hour) => `${date}T${hour.toString().padStart(2, "0")}:00`,
  );
}

it("includes the seventh local day and excludes the UTC spill into the eighth", () => {
  const now = new Date("2026-09-23T06:00:00Z");
  const hourly = hours(...Array.from({ length: 168 }, (_, i) => new Date(Date.parse("2026-09-23T00:00:00Z") + i * 3_600_000).toISOString().slice(0, 16)));
  const days = selectForecastDays(hourly, now);
  expect(days.map(day => day.dateKey)).toEqual(["2026-09-23", "2026-09-24", "2026-09-25", "2026-09-26", "2026-09-27", "2026-09-28", "2026-09-29"]);
  expect(days[6]!.hours.at(-1)!.time).toBe("2026-09-29T19:00");
});

it("formats a forecast date with its weekday", () => {
  expect(formatForecastDateOption("2026-09-23")).toBe("23 сентября (среда)");
});
