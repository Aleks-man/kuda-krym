import { expect, test } from "@playwright/test";

test("opens the Simferopol weather forecast without marine conditions", async ({ page }) => {
  await page.goto("/cities/simferopol");

  await expect(page.getByRole("heading", { level: 1, name: "Симферополь" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Исторический центр Симферополя и городская пешеходная улица" })).toBeVisible();

  const forecast = page.locator('section[aria-labelledby="forecast-title"]');
  await expect(forecast.getByText("Симферополь", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("Порывы", { exact: true })).toBeVisible();
  await expect(forecast.getByText("Облачность", { exact: true })).toBeVisible();
  await expect(forecast.getByText("Вода", { exact: true })).toHaveCount(0);
  await expect(forecast.getByText("Волна", { exact: true })).toHaveCount(0);
  await expect(forecast.getByText("Море — Open-Meteo Marine API")).toHaveCount(0);
  await forecast.getByRole("combobox", { name: "День прогноза" }).click();
  await expect(forecast.getByRole("option")).toHaveCount(7);
  await forecast.getByRole("combobox", { name: "День прогноза" }).press("Escape");
});

for (const place of [{ slug: "bakhchisaray", name: "Бахчисарай" }, { slug: "krasnogvardeyskoye", name: "Красногвардейское" }]) {
  test(`shows a weather-only page for ${place.name}`, async ({ page }) => {
    await page.goto(`/cities/${place.slug}`);
    await expect(page.getByRole("heading", { level: 1, name: place.name, exact: true })).toBeVisible();
    const forecast = page.getByRole("region", { name: "Погода сейчас", exact: true });
    await expect(forecast).toBeVisible();
    await expect(forecast.getByText(place.name, { exact: true }).first()).toBeVisible();
    await expect(page.locator("#forecast-days-timeline")).not.toContainText("Волна");
    await expect(page.locator("#forecast-days-timeline")).not.toContainText("Вода");
  });
}
