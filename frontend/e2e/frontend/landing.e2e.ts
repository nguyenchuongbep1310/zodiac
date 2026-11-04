import { test, expect } from "../fixtures";

test.describe("landing page", () => {
  test("renders every section without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));

    await page.goto("/");
    for (const id of ["#hero", "#features", "#how-it-works", "#astrology", "#learn", "#faq"]) {
      await expect(page.locator(id)).toBeAttached();
    }
    await expect(page.getByRole("button", { name: "Read My Chart" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("FAQ items expand and collapse", async ({ page }) => {
    await page.goto("/#faq");
    const question = page.getByRole("button", { name: "Do you use AI for interpretations?" });
    await question.scrollIntoViewIfNeeded();
    await expect(question).toHaveAttribute("aria-expanded", "false");
    await question.click();
    await expect(question).toHaveAttribute("aria-expanded", "true");
  });

  test("unknown birth time disables the time field", async ({ page }) => {
    await page.goto("/");
    await page.getByLabel("Unknown birth time").check();
    await expect(page.locator("#hero-time")).toBeDisabled();
  });

  test("city field suggests known cities", async ({ page }) => {
    await page.goto("/");
    const city = page.locator("#hero-city");
    await city.fill("Da Na");
    await expect(page.getByRole("listitem").filter({ hasText: "Đà Nẵng" })).toBeVisible();
  });

  test("dark mode toggle switches the theme", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    const before = await html.getAttribute("class");
    await page.getByRole("button", { name: "Toggle theme" }).click();
    await expect(html).not.toHaveAttribute("class", before ?? "");
  });
});
