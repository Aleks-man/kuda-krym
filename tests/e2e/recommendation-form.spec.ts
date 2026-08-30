import { expect, test } from "@playwright/test";

import { recommendationResponseFixture } from "./fixtures/recommendation-response";

test("submits preferences and shows a recommendation", async ({ page }) => {
  let submittedRequest: Record<string, unknown> | undefined;

  await page.route("**/api/recommendations", async (route) => {
    submittedRequest = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ json: recommendationResponseFixture });
  });

  await page.goto("/");

  await page.getByLabel("Откуда выезжаем").selectOption("yalta");
  await page.getByLabel("Максимум в дороге").selectOption("60");
  const preferences = page.locator("#preferences");
  const choices = ["Завтра", "Утро", "С детьми", "Песок", "Тёплая вода"];

  for (const choice of choices) {
    await preferences.getByText(choice, { exact: true }).click();
    await expect(
      preferences.getByRole("radio", { name: new RegExp(choice) }),
    ).toBeChecked();
  }
  await page.getByRole("button", { name: "Подобрать пляж" }).click();

  await expect(
    page.getByRole("heading", { level: 4, name: "Приморский пляж Ялты" }),
  ).toBeVisible();
  expect(submittedRequest).toMatchObject({
    origin: "yalta",
    time: "morning",
    company: "children",
    surface: "sand",
    priority: "warm_water",
    maxTravelMinutes: 60,
  });
  expect(submittedRequest?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});
