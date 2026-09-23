import { expect, test } from "@playwright/test";

test("shows verified beach media and a seven-day forecast", async ({ page }) => {
  await page.goto("/beaches/popovka");

  await expect(
    page.getByRole("heading", { level: 1, name: "Пляж Поповка" }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Закат над песчаным пляжем Поповки" }),
  ).toBeVisible();
  await expect(page.getByText("Фото побережья рядом")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "← Все пляжи" })).toHaveAttribute(
    "href",
    "/beaches",
  );

  const forecast = page.locator('section[aria-labelledby="forecast-title"]');
  await expect(
    forecast.getByRole("heading", {
      level: 2,
      name: "Прогноз на ближайшие часы",
    }),
  ).toBeVisible();
  await expect(forecast.getByText("Пляж Поповка", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("25 °C", { exact: true }).first()).toBeVisible();
  await expect(forecast.getByText("0.3 м", { exact: true }).first()).toBeVisible();
  await expect(
    forecast.getByRole("heading", { level: 3, name: "Прогноз на неделю" }),
  ).toBeVisible();
  await forecast.getByRole("combobox", { name: "День прогноза" }).click();
  await expect(forecast.getByRole("option")).toHaveCount(7);
  await forecast.getByRole("combobox", { name: "День прогноза" }).press("Escape");
  await expect(forecast.locator("#forecast-days-timeline")).toBeVisible();
});
