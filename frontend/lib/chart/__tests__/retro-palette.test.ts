import { describe, expect, it } from "vitest";
import { ASPECT_STYLE, ELEMENT_FILL, PLANET_GLYPH, ZODIAC_SIGNS } from "../constants";
import { PLANET_GLYPHS, ZODIAC_GLYPHS } from "../../utils";

/** Hue in degrees of a `#rrggbb` or `rgba(r,g,b,a)` colour. */
function hue(color: string): number {
  const rgb = color.startsWith("#")
    ? [1, 3, 5].map((i) => parseInt(color.slice(i, i + 2), 16))
    : (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (d === 0) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

describe("chart palette for the retro theme", () => {
  it("uses no violet/indigo hues (250-290°) for element colours", () => {
    for (const [name, c] of Object.entries(ELEMENT_FILL)) {
      for (const value of [c.sector, c.glyph, c.border]) {
        const h = hue(value);
        expect(h < 250 || h > 290, `${name} ${value} has hue ${Math.round(h)}`).toBe(true);
      }
    }
  });

  it("uses no violet/indigo hues for aspect lines", () => {
    for (const [name, style] of Object.entries(ASPECT_STYLE)) {
      const h = hue(style.color);
      expect(h < 250 || h > 290, `${name} ${style.color} has hue ${Math.round(h)}`).toBe(true);
    }
  });

  it("keeps the conventional trine=blue and square=red", () => {
    expect(ASPECT_STYLE.trine.color).toBe("#3b82f6");
    expect(ASPECT_STYLE.square.color).toBe("#ef4444");
  });
});

describe("glyphs are requested as text, not colour emoji", () => {
  const all = [
    ...Object.values(ZODIAC_GLYPHS),
    ...Object.values(PLANET_GLYPHS),
    ...Object.values(PLANET_GLYPH),
    ...ZODIAC_SIGNS.map((s) => s.glyph),
  ];

  it("every sign and planet glyph carries the U+FE0E text selector", () => {
    for (const glyph of all) expect(glyph.endsWith("︎"), glyph).toBe(true);
  });
});
