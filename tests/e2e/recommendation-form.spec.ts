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

test("explains partial and empty timeout results without claiming no beaches match", async ({ page }) => {
  let empty = false;
  await page.route("**/api/recommendations", route => route.fulfill({
    json: {
      ...recommendationResponseFixture,
      data: empty ? [] : recommendationResponseFixture.data,
      meta: { ...recommendationResponseFixture.meta, timedOut: true, recommendationCount: empty ? 0 : 1 },
    },
  }));
  await page.goto("/");
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await page.getByRole("option", { name: /^Завтра,/ }).click();
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await expect(page.getByText(/Не успели проверить все пляжи/)).toBeVisible();
  await expect(page.getByRole("heading", { level: 4, name: "Ялта" })).toBeVisible();

  empty = true;
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await expect(page.getByText("Не успели завершить проверку пляжей. Попробуйте повторить подбор.")).toBeVisible();
  await expect(page.getByText(/Для этих условий подходящих пляжей пока нет/)).toHaveCount(0);
});

test("shows stale data warnings and source timestamps in cards and alternatives", async ({ page }) => {
  let priority: "WARM_WATER" | "CALM_SEA" | "COMFORT" = "WARM_WATER";
  const weatherTime = "2026-10-01T06:00:00.000Z";
  const marineTime = "2026-09-30T18:00:00.000Z";
  await page.route("**/api/recommendations", route => route.fulfill({
    json: {
      ...recommendationResponseFixture,
      context: { ...recommendationResponseFixture.context, priority },
      data: Array.from({ length: 4 }, (_, index) => ({
        ...recommendationResponseFixture.data[0],
        position: index + 1,
        beach: {
          ...recommendationResponseFixture.data[0]!.beach,
          id: "f1f7c831-965f-46bb-9d34-2265ea080c7" + index,
        },
        confidencePercent: index === 0 || index === 3 ? 55 : 100,
        freshness: {
          status: index === 0 || index === 3 ? "STALE" : "FRESH",
          sources: {
            weather: { status: "FRESH", generatedAt: weatherTime },
            marine: {
              status: index === 0 || index === 3 ? "STALE" : "FRESH",
              generatedAt: index === 0 || index === 3 ? marineTime : weatherTime,
            },
            weatherModels: null,
          },
        },
      })),
      meta: { ...recommendationResponseFixture.meta, recommendationCount: 4 },
    },
  }));
  await page.goto("/");
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await page.getByRole("option", { name: /^Завтра,/ }).click();
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  const notes = page.getByRole("note", { name: "Свежесть прогноза" });
  await expect(notes).toHaveCount(3);
  await expect(notes.first()).toContainText("Прогноз устарел");
  await expect(notes.first()).toContainText("Уверенность оценки: 55%");
  await expect(notes.first().locator("time")).toHaveText([
    "1 октября в 09:00", "30 сентября в 21:00",
  ]);
  await expect(notes.nth(1)).not.toContainText("Прогноз устарел");
  await page.getByText("Показать остальные варианты", { exact: false }).click();
  const alternative = page.locator("li").filter({ hasText: "Данные моря не обновились" });
  await expect(alternative).toContainText("Вода 24 °C");
  await expect(alternative).toContainText("устаревшие данные");
  await expect(alternative.getByText("Погода обновлена:", { exact: false })).not.toBeVisible();
  await alternative.getByText("Данные моря не обновились", { exact: true }).click();
  await expect(notes).toHaveCount(4);
  await expect(notes.last()).toContainText("Прогноз устарел");
  for (const [nextPriority, expected] of [
    ["CALM_SEA", "Волны 0.3 м"],
    ["COMFORT", "Воздух 27 °C · Ветер 2.8 м/с · Вероятность осадков 5 %"],
  ] as const) {
    priority = nextPriority;
    await page.getByRole("button", { name: "Подобрать пляж" }).click();
    await expect(alternative).toContainText(expected);
  }
  await expect(alternative.getByTitle("Средние значения за выбранное время поездки")).not.toContainText("устаревшие данные");
});
