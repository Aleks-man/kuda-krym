import { expect, test } from "@playwright/test";

test("shows a two-day coastal forecast from all configured sources", async ({
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
  await expect(forecast.getByText("Сейчас рядом с Ялта")).toBeVisible();
  await expect(forecast.getByText("25 °C", { exact: true })).toBeVisible();
  await expect(forecast.getByText("0.3 м", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("3.2 м/с", { exact: true }).first()).toBeVisible();

  await expect(
    forecast.getByRole("heading", { level: 3, name: "Ближайшие два дня" }),
  ).toBeVisible();
  await expect(forecast.getByRole("heading", { level: 4 })).toHaveCount(2);

  const models = forecast.locator(
    'section[aria-labelledby="model-comparison-title"]',
  );
  await expect(
    models.getByRole("heading", { level: 3, name: "Высокая согласованность" }),
  ).toBeVisible();
  await expect(models.getByText("ECMWF IFS", { exact: true })).toBeVisible();
  await expect(models.getByText("DWD ICON", { exact: true })).toBeVisible();
  await expect(models.getByText("NOAA GFS", { exact: true })).toBeVisible();
});
