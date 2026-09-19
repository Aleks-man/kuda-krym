import { expect, test } from "@playwright/test";

for (const width of [1280, 320]) {
  for (const path of ["/beaches/popovka", "/coast/yalta", "/cities/simferopol"]) {
    test(`${path} groups apparent and air temperature in the current weather card at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route("https://api-maps.yandex.ru/**", route => route.abort());
      await page.goto(path);
      const card = page.getByRole("region", { name: "Погода сейчас", exact: true });
      await expect(card.getByText("Погода сейчас", { exact: true })).toBeVisible();
      const air = card.getByRole("group", { name: "Температура воздуха" });
      await expect(air.locator("strong")).toHaveText("26°");
      await expect(air.getByText("Ощущается как 29 °C", { exact: true })).toBeVisible();
      await expect(card.locator("dl > div")).toHaveCount(path.startsWith("/cities/") ? 5 : 6);
      const humidity = card.locator("dl > div").filter({ has: page.getByText("Влажность", { exact: true }) });
      await expect(humidity.locator("dd")).toHaveText("65 %");
      await expect(humidity).toBeVisible();
      await expect(card.locator("dl")).not.toContainText("Ощущается");
      const temperatureBox = (await air.locator("strong").boundingBox())!;
      const apparentBox = (await air.locator("span").boundingBox())!;
      expect(apparentBox.x).toBeGreaterThanOrEqual(temperatureBox.x + temperatureBox.width);
      expect(await air.locator("strong").evaluate(el => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(48);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await air.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    });
  }
}
