import { expect, test } from "@playwright/test";

test.describe("marine provider outage", () => {
  test.skip(process.env.E2E_MARINE_UNAVAILABLE !== "1", "Requires the marine outage fixture");
  for (const path of ["/coast/yalta", "/beaches/popovka"]) {
    test(`keeps weather visible at ${path}`, async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 900 });
      await page.route("https://api-maps.yandex.ru/**", route => route.abort());
      await page.goto(path);
      await expect(page.getByText("Морские данные недоступны", { exact: true })).toBeVisible();
      const card = page.getByRole("region", { name: "Погода сейчас", exact: true });
      await expect(card.getByRole("group", { name: "Температура воздуха" }).locator("strong")).toHaveText("26°");
      for (const label of ["Вода", "Волна"]) {
        await expect(card.locator("dl > div").filter({ has: page.getByText(label, { exact: true }) }).locator("dd")).toHaveText("—");
      }
      await expect(page.getByText("Прогноз временно недоступен", { exact: true })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    });
  }
});
