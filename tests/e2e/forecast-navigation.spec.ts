import { expect, test } from "@playwright/test";

const destinations = [
  { path: "/beaches/popovka", name: "Пляж Поповка", href: "/beaches", label: "Назад к выбору пляжа" },
  { path: "/coast/yalta", name: "Ялта", href: "/coast", label: "Назад к выбору населённого пункта" },
  { path: "/cities/simferopol", name: "Симферополь", href: "/coast", label: "Назад к выбору населённого пункта" },
];

for (const width of [1280, 390]) {
  for (const destination of destinations) {
    test(`forecast identifies ${destination.name} and returns to its catalog at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.route("https://api-maps.yandex.ru/**", route => route.abort());
      await page.goto(destination.path);
      const card = page.getByRole("tabpanel");
      const heading = card.locator("header");
      const place = heading.getByText(destination.name, { exact: true });
      await expect(place).toBeVisible();
      const date = heading.locator("strong");
      const updated = heading.locator("p");
      const placeBox = (await place.boundingBox())!;
      const dateBox = (await date.boundingBox())!;
      const updatedBox = (await updated.boundingBox())!;
      expect(placeBox.x).toBeGreaterThanOrEqual(dateBox.x + dateBox.width);
      if (width < 680) {
        expect(updatedBox.y).toBeGreaterThanOrEqual(dateBox.y + dateBox.height);
        expect(updatedBox.x).toBeLessThan(placeBox.x);
      } else {
        expect(updatedBox.x).toBeGreaterThan(placeBox.x);
      }

      // Changing the forecast day must keep the location context.
      await page.getByRole("tab").nth(1).click();
      await expect(page.getByRole("tab").nth(1)).toHaveAttribute("aria-selected", "true");
      await expect(place).toHaveText(destination.name);
      const back = card.getByRole("link", { name: destination.label, exact: true });
      await expect(back).toHaveAttribute("href", destination.href);
      await back.scrollIntoViewIfNeeded();
      await expect(back).toBeVisible();
      await back.click();
      await expect(page).toHaveURL(new RegExp(destination.href + "$"));
    });
  }
}

test("long beach names fit the forecast header on narrow phones", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.route("https://api-maps.yandex.ru/**", route => route.abort());
  await page.goto("/beaches/sudak-central");
  const card = page.getByRole("tabpanel");
  const place = card.locator("header").getByText("Центральный городской пляж Судака", { exact: true });
  await expect(place).toBeVisible();
  expect(await place.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(card.getByRole("link", { name: "Назад к выбору пляжа", exact: true })).toBeVisible();
});
