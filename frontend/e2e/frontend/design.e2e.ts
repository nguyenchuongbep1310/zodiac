import { test, expect } from "../fixtures";

// Guards the retro parlour look and keeps the "generic AI landing page"
// effects from creeping back in.
test.describe("retro design (light)", () => {
  test.use({ colorScheme: "light" });

  test("page is parchment paper with slab display type", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);

    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(243, 230, 200)");

    const h1 = await page.locator("h1").first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { family: s.fontFamily, ratio: parseFloat(s.lineHeight) / parseFloat(s.fontSize) };
    });
    expect(h1.family).toContain("Alfa Slab One");
    // Stacked Vietnamese diacritics need room between lines.
    expect(h1.ratio).toBeGreaterThanOrEqual(1.15);

    // The mono face is only downloaded once a page uses it, so check that next/font
    // registered it on <html> rather than that its file has loaded.
    const mono = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--font-space-mono"));
    expect(mono).toContain("Space Mono");
  });

  test("no gradient text anywhere on the landing page", async ({ page }) => {
    await page.goto("/");
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const s = getComputedStyle(el);
          return s.backgroundClip === "text" || s.webkitBackgroundClip === "text";
        })
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 60)}`),
    );
    expect(offenders).toEqual([]);
  });

  test("Vietnamese headline uses the same display setup", async ({ page }) => {
    await page.goto("/vi");
    await page.evaluate(() => document.fonts.ready);
    const family = await page.locator("h1").first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toContain("Alfa Slab One");
  });
});

test.describe("ink-border primitives (light)", () => {
  test.use({ colorScheme: "light" });

  test("primary button is a square-cornered ink block that sinks when pressed", async ({ page }) => {
    await page.goto("/");
    const button = page.locator("#hero form button[type=submit]");
    const style = () =>
      button.evaluate((el) => {
        const s = getComputedStyle(el);
        return { border: s.borderTopWidth, radius: parseFloat(s.borderTopLeftRadius), shadow: s.boxShadow, transform: s.transform };
      });

    const rest = await style();
    expect(rest.border).toBe("2px");
    expect(rest.radius).toBeLessThanOrEqual(6);
    expect(rest.shadow).toContain("4px 4px 0px");

    await button.hover();
    await page.mouse.down();
    const pressed = await style();
    await page.mouse.up();
    expect(pressed.transform).toBe("matrix(1, 0, 0, 1, 3, 3)");
    expect(pressed.shadow).toContain("1px 1px 0px");
  });
});
