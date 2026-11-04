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

test.describe("ticket-bar navbar and parlour footer (light)", () => {
  test.use({ colorScheme: "light" });

  test("header is a full-width solid bar with a 2px ink rule and no blur", async ({ page }) => {
    await page.goto("/");
    const bar = await page.locator("header").first().evaluate((el) => {
      const s = getComputedStyle(el);
      const outer = el.getBoundingClientRect();
      const blurred = [el, ...el.querySelectorAll("*")].filter((n) => getComputedStyle(n).backdropFilter !== "none").length;
      return { width: outer.width, viewport: window.innerWidth, border: s.borderBottomWidth, radius: parseFloat(s.borderBottomLeftRadius), blurred };
    });
    expect(bar.width).toBe(bar.viewport);
    expect(bar.border).toBe("2px");
    expect(bar.radius).toBeLessThanOrEqual(6);
    expect(bar.blurred).toBe(0);
  });

  test("footer is an ink block with mono link labels", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await footer.scrollIntoViewIfNeeded();
    expect(await footer.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe("rgb(28, 20, 16)");
    const family = await footer.getByRole("link", { name: "Learn" }).first().evaluate((el) => getComputedStyle(el).fontFamily);
    expect(family).toContain("Space Mono");
  });
});

test.describe("hero: tarot card and ticket form (light, desktop)", () => {
  test.use({ colorScheme: "light", viewport: { width: 1280, height: 800 } });

  test("chart wheel sits inside a tarot card", async ({ page }) => {
    await page.goto("/");
    const wheel = page.getByRole("img", { name: "Natal chart wheel preview" });
    await expect(wheel).toBeVisible();
    expect(await wheel.evaluate((el) => !!el.closest("[data-tarot]"))).toBe(true);
  });

  test("form is a ticket with a dashed perforation", async ({ page }) => {
    await page.goto("/");
    const style = await page.locator("#hero [data-perforation]").evaluate((el) => getComputedStyle(el).borderTopStyle);
    expect(style).toBe("dashed");
  });

  test("headline highlight is a solid gold marker, not a gradient", async ({ page }) => {
    await page.goto("/");
    const mark = await page.locator("#hero h1 [data-highlight]").evaluate((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, image: s.backgroundImage };
    });
    expect(mark.bg).toBe("rgb(217, 165, 33)");
    expect(mark.image).toBe("none");
  });

  test("a 100-character name does not break the layout", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero-name").fill("x".repeat(100));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("landing sections: tarot spread and motion rules (light)", () => {
  test.use({ colorScheme: "light" });

  const transforms = (page: import("@playwright/test").Page, selector: string) =>
    page.locator(selector).evaluateAll((els) => els.map((el) => getComputedStyle(el).transform));

  test("features are five tarot cards, tilted on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    expect(await page.locator("#features [data-tarot]").count()).toBe(5);
    const t = await transforms(page, "#features [data-tarot]");
    expect(t.some((v) => v !== "none")).toBe(true);
  });

  test("cards are not tilted on a phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    expect(new Set(await transforms(page, "[data-tarot]"))).toEqual(new Set(["none"]));
  });

  test("reduced motion stops the ticker and removes card tilt", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    expect(new Set(await transforms(page, "[data-tarot]"))).toEqual(new Set(["none"]));
    const animation = await page.locator("[data-marquee]").evaluate((el) => getComputedStyle(el).animationName);
    expect(animation).toBe("none");
  });

  test("no backdrop blur and no radius above 24px except stamps", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const s = getComputedStyle(el);
          const radii = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius];
          const tooRound = radii.some((r) => parseFloat(r) > 24) && !el.classList.contains("stamp");
          return s.backdropFilter !== "none" || tooRound;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class")).slice(0, 70)}`),
    );
    expect(offenders).toEqual([]);
  });
});
