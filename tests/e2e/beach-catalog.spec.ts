import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route("https://*.tile.openstreetmap.org/**", (route) => route.abort());
});

test("filters the published beach catalog by region", async ({ page }) => {
  await page.goto("/beaches");

  await expect(
    page.getByRole("heading", { level: 1, name: "Пляжи Крыма" }),
  ).toBeVisible();
  await expect(page.getByText("Опубликовано: 50")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(50);

  await page.getByRole("combobox", { name: "Регион" }).selectOption(
    "WEST_CRIMEA",
  );
  await page.getByRole("button", { name: "Показать" }).click();

  await expect
    .poll(() => new URL(page.url()).searchParams.get("region"))
    .toBe("WEST_CRIMEA");
  await expect(page.getByText("Найдено: 9")).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(9);
  await expect(
    page.getByRole("article").filter({
      has: page.getByRole("heading", { name: "Пляж Майами" }),
    }),
  ).toBeVisible();
});
