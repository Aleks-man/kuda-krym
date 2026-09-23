import { expect, test } from "@playwright/test";

test("labels hourly fallback honestly when current conditions are unavailable", async ({ page }) => {
  test.skip(process.env.E2E_CURRENT_UNAVAILABLE !== "1", "Requires a fixture without current conditions");
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  await page.goto("/coast/yalta");
  const card = page.getByRole("region", { name: "Погода сейчас", exact: true });
  await expect(card.getByText("Почасовой прогноз", { exact: true })).toBeVisible();
  await expect(card.getByText("Погода сейчас", { exact: true })).toHaveCount(0);
  await expect(card.getByRole("group", { name: "Температура воздуха" }).locator("strong")).toHaveText("26°");
  await expect(card.getByText("Осадки за час", { exact: true })).toBeVisible();
  await expect(page.locator("#forecast-days-timeline")).toBeVisible();
});
