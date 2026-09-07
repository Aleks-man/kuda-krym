import { expect, test } from "@playwright/test";

test("shows a three-day coastal forecast from all configured sources", async ({
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
    forecast.getByRole("heading", { level: 3, name: "Ближайшие три дня" }),
  ).toBeVisible();
  await expect(forecast.getByRole("heading", { level: 4 })).toHaveCount(3);

  await expect(
    forecast.getByRole("progressbar", { name: "Надёжность прогноза" }),
  ).toBeVisible();
});
