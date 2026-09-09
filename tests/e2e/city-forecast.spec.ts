import { expect, test } from "@playwright/test";

test("opens the Simferopol weather forecast without marine conditions", async ({ page }) => {
  await page.goto("/cities/simferopol");

  await expect(page.getByRole("heading", { level: 1, name: "Симферополь" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Исторический центр Симферополя и городская пешеходная улица" })).toBeVisible();

  const forecast = page.locator('section[aria-labelledby="forecast-title"]');
  await expect(forecast.getByText("Симферополь", { exact: true })).toBeVisible();
  await expect(forecast.getByText("Порывы", { exact: true })).toBeVisible();
  await expect(forecast.getByText("Облачность", { exact: true })).toBeVisible();
  await expect(forecast.getByText("Вода", { exact: true })).toHaveCount(0);
  await expect(forecast.getByText("Волна", { exact: true })).toHaveCount(0);
  await expect(forecast.getByText("Море — Open-Meteo Marine API")).toHaveCount(0);
  await expect(forecast.getByRole("tab")).toHaveCount(3);
});
