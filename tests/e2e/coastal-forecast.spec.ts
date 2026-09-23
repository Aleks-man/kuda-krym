import { expect, test } from "@playwright/test";

test("shows a seven-day coastal forecast from all configured sources", async ({
  page,
}) => {
  await page.goto("/coast/yalta");

  const forecast = page.locator('section[aria-labelledby="forecast-title"]');
  await expect(
    forecast.getByRole("heading", {
      level: 2,
      name: "Прогноз на ближайшие часы",
    }),
  ).toBeVisible();
  await expect(forecast.getByText("Ялта", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText(/^Обновлено /).first()).toBeVisible();
  await expect(forecast.getByText("25 °C", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("0.3 м", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("3.2 м/с", { exact: true }).first()).toBeVisible();

  await expect(
    forecast.getByRole("heading", { level: 3, name: "Прогноз на неделю" }),
  ).toBeVisible();
  await forecast.getByRole("combobox", { name: "День прогноза" }).click();
  await expect(forecast.getByRole("option")).toHaveCount(7);
  await forecast.getByRole("combobox", { name: "День прогноза" }).press("Escape");
  await expect(forecast.locator("#forecast-days-timeline")).toBeVisible();

  await expect(
    forecast.getByRole("progressbar", { name: "Надёжность прогноза" }),
  ).toBeVisible();
});
