import { type Page } from "@playwright/test";

// Freeze browser time for this scenario while leaving timers and server freshness checks running.
export async function prepareForecastCalendar(page: Page): Promise<string[]> {
  const now = new Date();
  await page.clock.setFixedTime(now);

  // The UI shows today plus six days, but only hours that have not started yet.
  // After 23:00 in Crimea the first available hour belongs to tomorrow.
  const localNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const firstDay = localNow.getUTCHours() === 23
    && (localNow.getUTCMinutes() !== 0 || localNow.getUTCSeconds() !== 0 || localNow.getUTCMilliseconds() !== 0)
    ? 1 : 0;
  localNow.setUTCHours(12, 0, 0, 0);

  return Array.from({ length: 7 - firstDay }, (_, index) => {
    const date = new Date(localNow.getTime() + (firstDay + index) * 86_400_000);
    const label = new Intl.DateTimeFormat("ru-RU", {
      day: "numeric", month: "long", timeZone: "UTC",
    }).format(date);
    const weekday = new Intl.DateTimeFormat("ru-RU", {
      weekday: "long", timeZone: "UTC",
    }).format(date);
    return `${label} (${weekday})`;
  });
}
