import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(join(__dirname, "../../app/globals.css"), "utf8");

/** Hue in degrees of `#rrggbb`; greys (no saturation) have no hue. */
function hue(hex: string): number | null {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (d < 0.02) return null;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

// Global Constraint: no colour with a hue between 250° and 290° as a brand colour.
describe("globals.css colour tokens", () => {
  it("defines no violet/indigo hex tokens (the old purple palette is gone)", () => {
    const tokens = [...css.matchAll(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)].map(([, name, value]) => ({ name, value, h: hue(value) }));
    const violet = tokens.filter((t) => t.h !== null && t.h >= 250 && t.h <= 290).map((t) => `${t.name}: ${t.value}`);
    expect(violet).toEqual([]);
  });
});
