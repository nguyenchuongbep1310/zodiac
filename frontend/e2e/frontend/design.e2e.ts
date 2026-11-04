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

test.describe("inner pages share the retro look (light)", () => {
  test.use({ colorScheme: "light" });

  for (const path of ["/learn", "/learn/birth-chart/sun-moon", "/learn/birth-chart/planets", "/synastry", "/contact", "/privacy", "/terms", "/no-such-page"]) {
    test(`${path} is parchment with no gradient text, blur or rounded-card look`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(243, 230, 200)");

      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => {
            const s = getComputedStyle(el);
            const radii = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius];
            const tooRound = radii.some((r) => parseFloat(r) > 24) && !el.classList.contains("stamp");
            return s.backdropFilter !== "none" || s.backgroundClip === "text" || tooRound;
          })
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class")).slice(0, 80)}`),
      );
      expect(offenders).toEqual([]);

      // Surfaces are warm paper (--am-surface / --am-field), never pure white.
      const whites = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter((el) => getComputedStyle(el).backgroundColor === "rgb(255, 255, 255)")
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class")).slice(0, 70)}`),
      );
      expect(whites).toEqual([]);
    });
  }
});

test.describe("install and share metadata use the parlour palette", () => {
  test("web manifest carries the oxblood theme colour on parchment", async ({ request }) => {
    const manifest = await (await request.get("/manifest.webmanifest")).json();
    expect(manifest.theme_color).toBe("#8b1e1e");
    expect(manifest.background_color).toBe("#f3e6c8");
  });

  test("social image is still a 1200x630 PNG", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    const png = await res.body();
    // PNG IHDR: width and height are big-endian u32 at bytes 16 and 20.
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
  });
});

// ── Review fixes ────────────────────────────────────────────────────────────

/** Browser-side WCAG contrast between two `rgb()/rgba()` strings. */
const contrastScript = `
  (a, b) => {
    const lum = (c) => {
      const [r, g, b] = c.match(/[\\d.]+/g).slice(0, 3).map((v) => {
        v = Number(v) / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (hi + 0.05) / (lo + 0.05);
  }
`;

test.describe("utility classes respect Tailwind (light)", () => {
  test.use({ colorScheme: "light" });

  test("a text size next to .mono-label still applies (utilities are layered)", async ({ page }) => {
    await page.goto("/");
    const size = await page.locator("#how-it-works .stamp").first().evaluate((el) => getComputedStyle(el).fontSize);
    expect(size).toBe("20px"); // text-xl; an unlayered .mono-label would pin it to 12px
  });
});

for (const scheme of ["light", "dark"] as const) {
  test.describe(`keyboard focus is visible on dark and coloured blocks (${scheme})`, () => {
    test.use({ colorScheme: scheme });

    for (const [name, selector, container] of [
      ["CTA link", 'section a[href="#hero"]', "section"],
      ["footer link", "footer a", "footer"],
    ] as const) {
      test(`${name} focus ring has at least 3:1 against its surroundings`, async ({ page }) => {
        await page.goto("/");
        await page.waitForLoadState("networkidle"); // hydration can steal focus if it lands mid-test
        const target = page.locator(selector).first();
        await target.scrollIntoViewIfNeeded();
        await page.keyboard.press("Tab"); // switch to keyboard modality so :focus-visible applies
        const ringContrast = async () => {
          await target.focus();
          return target.evaluate(
            (el, { script, container }) => {
              const ring = getComputedStyle(el).outlineColor;
              const bg = getComputedStyle(el.closest(container)!).backgroundColor;
              return (eval(script) as (a: string, b: string) => number)(ring, bg);
            },
            { script: contrastScript, container },
          );
        };
        // transition-colors animates outline-color for 150ms, so wait for the settled value.
        await expect.poll(ringContrast, { timeout: 3000 }).toBeGreaterThanOrEqual(3);
      });
    }
  });
}

test.describe("mobile drawer in dark mode", () => {
  test.use({ colorScheme: "dark", viewport: { width: 375, height: 812 } });

  test("is square, flat and readable", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.getByRole("button", { name: "Tiếng Việt" }).last()).toBeVisible();

    const offenders = await page.evaluate(() =>
      [...document.querySelectorAll("body *")]
        .filter((el) => {
          const s = getComputedStyle(el);
          const radii = [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomLeftRadius, s.borderBottomRightRadius];
          return s.backdropFilter !== "none" || (radii.some((r) => parseFloat(r) > 24) && !el.classList.contains("stamp"));
        })
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.getAttribute("class")).slice(0, 70)}`),
    );
    expect(offenders).toEqual([]);

    const ratio = await page.locator('[aria-pressed="true"]').last().evaluate((el, script) => {
      const s = getComputedStyle(el);
      return (eval(script) as (a: string, b: string) => number)(s.color, s.backgroundColor);
    }, contrastScript);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});

test.describe("Vietnamese headline on a phone (light)", () => {
  test.use({ colorScheme: "light", viewport: { width: 375, height: 812 } });

  test("keeps its line-height and does not overflow its own box", async ({ page }) => {
    await page.goto("/vi");
    await page.evaluate(() => document.fonts.ready);
    const h1 = await page.locator("h1").first().evaluate((el) => {
      const s = getComputedStyle(el);
      return { ratio: parseFloat(s.lineHeight) / parseFloat(s.fontSize), overflow: el.scrollHeight - el.clientHeight };
    });
    expect(h1.ratio).toBeGreaterThanOrEqual(1.15);
    expect(h1.overflow).toBeLessThanOrEqual(1);
  });
});

test.describe("a 100-character name on the smallest phone (light)", () => {
  test.use({ colorScheme: "light", viewport: { width: 320, height: 640 } });

  test("keeps the ticket inside the viewport", async ({ page }) => {
    await page.goto("/");
    await page.locator("#hero-name").fill("x".repeat(100));
    const box = await page.locator("#hero-name").evaluate((el) => ({
      ticketRight: el.closest(".ink-border")!.getBoundingClientRect().right,
      viewport: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(box.ticketRight).toBeLessThanOrEqual(box.viewport);
    expect(box.scrollWidth).toBeLessThanOrEqual(box.viewport);
  });
});

test.describe("hover motion respects reduced-motion (light, desktop)", () => {
  test.use({ colorScheme: "light", viewport: { width: 1280, height: 800 } });

  const cardTransform = async (page: import("@playwright/test").Page) => {
    const card = page.locator("#learn .group").first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(300);
    return card.evaluate((el) => getComputedStyle(el).transform);
  };

  test("article cards lift on hover normally", async ({ page }) => {
    await page.goto("/");
    expect(await cardTransform(page)).not.toBe("none");
  });

  test("and stay still when the user asks for reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    expect(await cardTransform(page)).toBe("none");
  });
});
