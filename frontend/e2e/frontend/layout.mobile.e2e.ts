import { test, expect } from "../fixtures";

test.describe("mobile layout", () => {
  for (const path of ["/", "/vi", "/learn", "/synastry"]) {
    test(`${path} has no horizontal overflow`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }

  test("menu drawer opens and navigates", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    // The footer also has a "Synastry Chart" link; pick the visible drawer one.
    await page.getByRole("link", { name: "Synastry", exact: true }).locator("visible=true").click();
    await expect(page).toHaveURL(/\/synastry$/);
  });
});

test.describe("smallest phone: 320px", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  for (const path of ["/", "/vi", "/learn", "/synastry"]) {
    test(`${path} has no horizontal overflow at 320px`, async ({ page }) => {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });
  }
});
