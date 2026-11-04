import { test, expect } from "../fixtures";

test.describe("locale routing", () => {
  test("English lives at unprefixed URLs", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Let the stars");
  });

  test("Vietnamese is server-rendered under /vi", async ({ request, page }) => {
    // Raw HTML, before any client JS: this is what search engines index.
    const html = await (await request.get("/vi")).text();
    expect(html).toContain('<html lang="vi"');
    expect(html).toContain("Để các vì sao");

    await page.goto("/vi");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Để các vì sao");
  });

  test("/en prefix redirects to the unprefixed URL", async ({ request }) => {
    const res = await request.get("/en/learn", { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers()["location"]).toMatch(/\/learn$/);
  });

  test("language switch keeps the current page", async ({ page }) => {
    await page.goto("/learn");
    await page.getByRole("button", { name: "Tiếng Việt" }).click();
    await expect(page).toHaveURL(/\/vi\/learn$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");

    await page.getByRole("button", { name: "English" }).click();
    await expect(page).toHaveURL(/\/learn$/);
    await expect(page).not.toHaveURL(/\/vi\//);
  });

  test("returning Vietnamese visitors on / land on /vi", async ({ page }) => {
    await page.goto("/vi");
    await page.goto("/");
    await expect(page).toHaveURL(/\/vi$/);
  });

  test("internal links stay in the current language", async ({ page }) => {
    await page.goto("/vi/learn");
    const firstArticle = page.locator('a[href^="/vi/learn/"]').first();
    await expect(firstArticle).toBeVisible();
    await firstArticle.click();
    await expect(page).toHaveURL(/\/vi\/learn\/.+/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });

  test("unknown pages return 404 in both languages", async ({ request, page }) => {
    expect((await request.get("/this-does-not-exist")).status()).toBe(404);
    expect((await request.get("/vi/khong-ton-tai")).status()).toBe(404);

    await page.goto("/vi/khong-ton-tai");
    await expect(page.getByText("Không Tìm Thấy Trang")).toBeVisible();
  });
});
