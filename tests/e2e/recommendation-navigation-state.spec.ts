import { expect, test, type Page } from "@playwright/test";
import { recommendationResponseFixture } from "./fixtures/recommendation-response";

async function chooseTrip(page: Page) {
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Ялта");
  await page.getByRole("option", { name: /^Ялта/ }).first().click();
  await page.getByRole("combobox", { name: "Максимум в дороге" }).click();
  await page.getByRole("option", { name: "До 1,5 часов" }).click();
  await page.getByRole("combobox", { name: "Дата поездки" }).click();
  await page.getByRole("option", { name: /^Завтра,/ }).click();
  await page.locator("#preferences").getByText("Утро", { exact: true }).click();
  await page.locator("#preferences").getByText("Тёплая вода", { exact: true }).click();
}

for (const beachOnly of [false, true]) {
  test("restores the trip and selected date for " + (beachOnly ? "a beach" : "a coastal forecast"), async ({ page }) => {
    test.setTimeout(90_000);
    let count = 0;
    let selectedDate = "";
    await page.route("**/api/recommendations", async route => {
      count++;
      const request = route.request().postDataJSON();
      selectedDate = request.date;
      await route.fulfill({ json: {
        ...recommendationResponseFixture,
        data: beachOnly ? [{ ...recommendationResponseFixture.data[0], beach: { ...recommendationResponseFixture.data[0]!.beach, slug: "popovka", name: "Поповка", coastalLocation: null } }] : recommendationResponseFixture.data,
        context: { ...recommendationResponseFixture.context, date: request.date, maxTravelMinutes: request.maxTravelMinutes },
      } });
    });
    await page.goto("/");
    await chooseTrip(page);
    await page.getByRole("button", { name: "Подобрать пляж" }).click();
    const link = page.getByRole("link", { name: beachOnly ? "Открыть пляж Поповка" : "Открыть прогноз для Ялта", exact: true });
    await expect(link).toBeVisible();
    expect(await link.getAttribute("href")).toContain("date=" + selectedDate);
    await link.click();
    await expect(page).toHaveURL(new RegExp(beachOnly ? "/beaches/popovka" : "/coast/yalta"), { timeout: 20_000 });
    expect(new URL(page.url()).searchParams.get("date")).toBe(selectedDate);
    await expect(page.locator('input[name="forecastDate"]')).toHaveValue(selectedDate);
    await expect.poll(() => page.locator('[aria-label="Почасовой прогноз: прокрутка по времени"]').evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
    await page.reload();
    await expect(page.locator('input[name="forecastDate"]')).toHaveValue(selectedDate);
    await page.getByRole("link", { name: "← К подбору", exact: true }).click();
    await expect(page).toHaveURL(/\/#preferences$/, { timeout: 20_000 });
    await expect(link).toBeVisible();
    await expect(page.getByRole("combobox", { name: "Откуда выезжаем" })).toHaveValue("Ялта");
    await expect(page.locator('#preferences input[name="maxTravelMinutes"]')).toHaveValue("90");
    await expect(page.locator('#preferences input[name="date"]')).toHaveValue("tomorrow");
    await expect(page.getByRole("radio", { name: /Утро/ })).toBeChecked();
    await expect(page.getByRole("radio", { name: /Тёплая вода/ })).toBeChecked();
    await page.reload();
    await expect(link).toBeVisible();
    expect(count).toBe(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(beachOnly ? "/beaches/popovka" : "/coast/yalta"), { timeout: 20_000 });
    await page.goBack();
    await expect(page).toHaveURL(/\/(?:#preferences)?$/, { timeout: 20_000 });
    await expect(link).toBeVisible();
    expect(count).toBe(1);
  });
}

test("restores an unfinished form without sending a recommendation request", async ({ page }) => {
  let count = 0;
  await page.route("**/api/recommendations", route => { count++; return route.fulfill({ json: recommendationResponseFixture }); });
  await page.goto("/");
  await chooseTrip(page);
  await page.getByRole("combobox", { name: "Откуда выезжаем" }).fill("Нов");
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Откуда выезжаем" })).toHaveValue("Нов");
  await expect(page.locator('#preferences input[name="origin"]')).toHaveValue("");
  await expect(page.locator('#preferences input[name="maxTravelMinutes"]')).toHaveValue("90");
  await expect(page.getByRole("radio", { name: /Тёплая вода/ })).toBeChecked();
  expect(count).toBe(0);
});

test("storage failure does not prevent submitting or returning to results", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(window, "sessionStorage", { get() { throw new Error("Storage blocked"); } }));
  let count = 0;
  await page.route("**/api/recommendations", route => {
    count++;
    const request = route.request().postDataJSON();
    return route.fulfill({ json: { ...recommendationResponseFixture, context: { ...recommendationResponseFixture.context, date: request.date } } });
  });
  await page.goto("/");
  await chooseTrip(page);
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  const link = page.getByRole("link", { name: "Открыть прогноз для Ялта", exact: true });
  await link.click();
  await expect(page).toHaveURL(/\/coast\/yalta/, { timeout: 20_000 });
  await page.getByRole("link", { name: "← К подбору", exact: true }).click();
  await expect(link).toBeVisible();
  expect(count).toBe(1);
});


test("expired results retain the form without an automatic request", async ({ page }) => {
  let count = 0;
  await page.route("**/api/recommendations", route => {
    count++;
    const request = route.request().postDataJSON();
    return route.fulfill({ json: { ...recommendationResponseFixture, context: { ...recommendationResponseFixture.context, date: request.date } } });
  });
  await page.goto("/");
  await chooseTrip(page);
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await expect(page.getByRole("heading", { name: "Куда лучше поехать к морю" })).toBeVisible();
  await page.evaluate(() => {
    const key = "kuda-krym:recommendations:v1";
    const saved = JSON.parse(sessionStorage.getItem(key)!);
    saved.resultSavedAt = Date.now() - 31 * 60 * 1000;
    sessionStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await expect(page.getByRole("combobox", { name: "Откуда выезжаем" })).toHaveValue("Ялта");
  await expect(page.getByRole("radio", { name: /Тёплая вода/ })).toBeChecked();
  await expect(page.getByRole("heading", { name: "Куда лучше поехать к морю" })).toHaveCount(0);
  expect(count).toBe(1);
});

test("opens the chosen alternative rather than the first result, on the trip date", async ({ page }) => {
  let date = "";
  await page.route("**/api/recommendations", route => {
    date = route.request().postDataJSON().date;
    return route.fulfill({ json: {
      ...recommendationResponseFixture,
      data: Array.from({ length: 4 }, (_, index) => ({
        ...recommendationResponseFixture.data[0],
        position: index + 1,
        beach: {
          ...recommendationResponseFixture.data[0]!.beach,
          id: "f1f7c831-965f-46bb-9d34-2265ea080c7" + index,
          coastalLocation: index === 3
            ? { ...recommendationResponseFixture.data[0]!.beach.coastalLocation!, slug: "sudak", name: "Судак" }
            : recommendationResponseFixture.data[0]!.beach.coastalLocation,
        },
      })),
      context: { ...recommendationResponseFixture.context, date },
      meta: { ...recommendationResponseFixture.meta, recommendationCount: 4 },
    } });
  });
  await page.goto("/");
  await chooseTrip(page);
  await page.getByRole("button", { name: "Подобрать пляж" }).click();
  await page.getByText("Показать остальные варианты", { exact: false }).click();
  await page.locator('section[aria-labelledby="recommendation-results-title"]').getByRole("link").filter({ hasText: "Судак" }).click();
  await expect(page).toHaveURL(/\/coast\/sudak/, { timeout: 20_000 });
  await expect(page.getByRole("heading", { level: 1, name: "Погода: Судак" })).toBeVisible();
  await expect(page.locator('input[name="forecastDate"]')).toHaveValue(date);
});
