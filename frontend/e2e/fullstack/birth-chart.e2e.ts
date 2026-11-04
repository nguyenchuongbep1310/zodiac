import { test, expect } from "../fixtures";

test.describe("birth chart flow (frontend + backend)", () => {
  test("hero form creates a chart and opens it", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero-name").fill("Playwright");
    await page.locator("#hero-date").fill("1995-10-24");
    await page.locator("#hero-time").fill("08:30");
    await page.locator("#hero-city").fill("Hanoi");

    const calculated = page.waitForResponse((r) => r.url().includes("/api/v1/charts/calculate"));
    await page.getByRole("button", { name: "Reveal My Chart" }).click();
    expect((await calculated).status()).toBe(201);

    await expect(page).toHaveURL(/\/charts\/[0-9a-f-]{36}$/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Playwright");
    await expect(page.getByRole("img", { name: "Natal chart wheel" })).toBeVisible();
    await expect(page.getByText(/Sun/).first()).toBeVisible();
  });

  test("Vietnamese flow stays on /vi and shows Vietnamese content", async ({ page }) => {
    await page.goto("/vi");
    await page.locator("#hero-city").fill("Đà Nẵng");
    await page.getByRole("button", { name: "Xem Bản Đồ Của Tôi" }).click();

    await expect(page).toHaveURL(/\/vi\/charts\/[0-9a-f-]{36}$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("img", { name: "Natal chart wheel" })).toBeVisible();
    await expect(page.getByText("Mặt Trời").first()).toBeVisible();
  });

  test("unknown birth time still produces a chart", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Unknown birth time").check();
    await page.locator("#hero-city").fill("London");
    await page.getByRole("button", { name: "Reveal My Chart" }).click();
    await expect(page).toHaveURL(/\/charts\/[0-9a-f-]{36}$/);
    await expect(page.getByRole("img", { name: "Natal chart wheel" })).toBeVisible();
  });

  test("an unknown city shows an error instead of submitting", async ({ page }) => {
    let calculateCalls = 0;
    page.on("request", (r) => r.url().includes("/charts/calculate") && calculateCalls++);

    await page.goto("/");
    await page.locator("#hero-city").fill("Zzyzx Nowhere");
    await page.getByRole("button", { name: "Reveal My Chart" }).click();
    await expect(page.getByText("Location not found")).toBeVisible();
    expect(calculateCalls).toBe(0);
  });

  test("chart tabs switch between planets, aspects and houses", async ({ page, request }) => {
    const { id } = await (
      await request.post("/api/v1/charts/calculate", {
        data: { name: "Tabs", birth_date: "2000-01-01", birth_time: "12:00", timezone: "Europe/London", latitude: 51.5074, longitude: -0.1278, city: "London" },
      })
    ).json();

    await page.goto(`/charts/${id}`);
    await page.getByRole("button", { name: /Aspects/ }).first().click();
    await expect(page.getByRole("heading", { name: "Aspects", level: 2 })).toBeVisible();
    await page.getByRole("button", { name: /Houses/ }).first().click();
    await expect(page.getByRole("heading", { name: /House Cusps/i, level: 2 })).toBeVisible();
  });

  test("a chart id that doesn't exist shows the not-found state", async ({ page }) => {
    await page.goto("/charts/00000000-0000-0000-0000-000000000000");
    await expect(page.getByText(/not found/i).first()).toBeVisible();
  });
});

test.describe("synastry flow (frontend + backend)", () => {
  test("compares two people", async ({ page }) => {
    await page.goto("/synastry");

    const fillPerson = async (name: string, date: string, city: string) => {
      await page.getByPlaceholder("e.g. Alex").fill(name);
      await page.locator('input[type="date"]').fill(date);
      await page.getByPlaceholder("Start typing city name...").fill(city);
    };

    await fillPerson("Alex", "1995-10-24", "Hanoi");
    await page.getByRole("button", { name: /Next: Person 2 Details/ }).click();
    // Step 2 animates in; fill only once its form is the one on screen.
    await expect(page.getByText("Person 2 — Name (optional)")).toBeVisible();
    await expect(page.getByText("Person 1 — Name (optional)")).toHaveCount(0);
    await fillPerson("Sam", "1997-03-12", "Tokyo");

    const calls = page.waitForResponse((r) => r.url().includes("/charts/calculate") && r.status() === 201);
    await page.getByRole("button", { name: "Create Synastry Chart" }).click();
    await calls;

    await expect(page.getByText("Connection strength")).toBeVisible();
    await expect(page.getByRole("img", { name: "Natal chart wheel" })).toBeVisible();
    await page.getByRole("button", { name: "Sam" }).click();
    await expect(page.getByRole("img", { name: "Natal chart wheel" })).toBeVisible();
  });
});
