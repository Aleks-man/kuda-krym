import { expect, test } from "@playwright/test";

for (const width of [1280, 320]) {
  for (const path of ["/beaches/popovka", "/coast/yalta", "/cities/simferopol"]) {
    test(`${path} groups apparent and air temperature in the current weather card at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.route("https://api-maps.yandex.ru/**", route => route.abort());
      await page.goto(path);
      const card = page.getByRole("region", { name: "Погода сейчас", exact: true });
      await expect(card.getByText("Погода сейчас", { exact: true })).toBeVisible();
      await expect(card.getByText("УФ-индекс 4.2", { exact: true })).toBeVisible();
      await expect(card.getByText("Давление 760 мм рт. ст.", { exact: true })).toBeVisible();
      await expect(card.getByText("Видимость 24 км", { exact: true })).toBeVisible();
      const uv = page.getByRole("tabpanel").getByRole("article").first().locator("dl > div").filter({ has: page.getByText("УФ-индекс", { exact: true }) });
      await expect(uv.locator("dd")).toHaveText("4.2");
      if (!path.startsWith("/cities/")) await expect(uv.locator("xpath=preceding-sibling::div[1]/dt")).toHaveText("Волна");
      await expect(page.getByRole("tabpanel")).not.toContainText("Давление");
      await expect(page.getByRole("tabpanel")).not.toContainText("Видимость");
      for (const value of ["6.0", "8.0", "11.0"]) {
        const warning = page.getByRole("tabpanel").locator("dd > span[data-warning]").filter({ hasText: value });
        await expect(warning).toHaveCount(1);
        await expect(warning).toHaveCSS("color", "rgb(180, 35, 24)");
      }
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
