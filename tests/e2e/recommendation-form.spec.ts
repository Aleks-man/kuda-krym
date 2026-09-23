import { expect, test } from "@playwright/test";

import { recommendationResponseFixture } from "./fixtures/recommendation-response";

test("submits preferences and shows a recommendation", async ({ page }) => {
  let submittedRequest: Record<string, unknown> | undefined;

  await page.route("**/api/recommendations", async (route) => {
    submittedRequest = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ json: recommendationResponseFixture });
  });

  await page.goto("/");

  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page
    .getByRole("combobox", { name: "Максимум в дороге" })
    .click();
  await page.getByRole("option", { name: "До 1 часа" }).click();
  const preferences = page.locator("#preferences");
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await page.getByRole("option", { name: /^Завтра,/ }).click();
  const choices = ["Утро", "Тёплая вода"];

  for (const choice of choices) {
    await preferences.getByText(choice, { exact: true }).click();
    await expect(
      preferences.getByRole("radio", { name: new RegExp(choice) }),
    ).toBeChecked();
  }
  await page.getByRole("button", { name: "Подобрать пляж" }).click();

  await expect(
    page.getByRole("heading", { level: 4, name: "Ялта" }),
  ).toBeVisible();
  expect(submittedRequest).toMatchObject({
    origin: "yalta",
    time: "morning",
    priority: "warm_water",
    maxTravelMinutes: 60,
  });
  expect(submittedRequest?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
});

test("submits the seventh day selected from the date dropdown", async ({ page }) => {
  let submitted: Record<string, unknown> | undefined;
  await page.clock.setFixedTime(new Date("2026-09-29T22:30:00Z"));
  await page.route("**/api/departure-locations?**", route => route.fulfill({ json: { data: [] } }));
  await page.route("**/api/recommendations", async route => { submitted = route.request().postDataJSON(); await route.fulfill({ json: recommendationResponseFixture }); });
  await page.goto("/");
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await expect(page.getByRole("option")).toHaveCount(7);
  await page.getByRole("option", { name: "6 октября (вторник)", exact: true }).click();
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await expect.poll(() => submitted?.date).toBe("2026-10-06");
  await page.unrouteAll({ behavior: "wait" });
});
