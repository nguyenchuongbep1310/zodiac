import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { contrastRatio, readTokens } from "./contrast";

const css = readFileSync(join(__dirname, "../../app/globals.css"), "utf8");

describe("retro design tokens", () => {
  it("light theme uses the parchment background", () => {
    expect(readTokens(css, "light")["--am-bg"]).toBe("#f3e6c8");
  });

  it("dark theme uses the night background", () => {
    expect(readTokens(css, "dark")["--am-bg"]).toBe("#170e0b");
  });

  for (const theme of ["light", "dark"] as const) {
    describe(`${theme} contrast`, () => {
      const t = readTokens(css, theme);
      const pairs: Array<[string, string]> = [
        ["--am-ink", "--am-bg"],
        ["--am-ink", "--am-surface"],
        ["--am-muted", "--am-bg"],
        ["--am-muted", "--am-surface"],
        ["--am-primary-ink", "--am-primary"],
      ];
      for (const [fg, bg] of pairs) {
        it(`${fg} on ${bg} is at least 4.5:1`, () => {
          expect(contrastRatio(t[fg], t[bg])).toBeGreaterThanOrEqual(4.5);
        });
      }
    });
  }

  it("contrastRatio matches the WCAG reference for black on white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });
});
