import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Ornament } from "../Ornament";
import { Stamp } from "../Stamp";
import { TarotCard } from "../TarotCard";

describe("TarotCard", () => {
  it("renders numeral, title and body, marked for tests and styling", () => {
    const html = renderToStaticMarkup(h(TarotCard, { numeral: "IV", title: "The Moon", children: h("p", null, "body copy") }));
    expect(html).toContain("IV");
    expect(html).toContain("The Moon");
    expect(html).toContain("body copy");
    expect(html).toContain("data-tarot");
  });

  it("exposes the tilt as a CSS variable and rotates only from md up, never under reduced motion", () => {
    const html = renderToStaticMarkup(h(TarotCard, { numeral: "I", title: "t", tilt: -2, children: "x" }));
    expect(html).toContain("--tilt:-2deg");
    expect(html).toMatch(/motion-safe:md:\[transform:rotate\(var\(--tilt\)\)\]/);
  });

  it("sets no inline tilt style when tilt is 0", () => {
    const html = renderToStaticMarkup(h(TarotCard, { numeral: "I", title: "t", children: "x" }));
    expect(html).not.toContain("style=");
  });

  it("merges a custom className", () => {
    const html = renderToStaticMarkup(h(TarotCard, { numeral: "I", title: "t", className: "w-40", children: "x" }));
    expect(html).toContain("w-40");
  });
});

describe("Stamp", () => {
  it("is a round stamp with the 'stamp' class and its text", () => {
    const html = renderToStaticMarkup(h(Stamp, { children: "FREE" }));
    expect(html).toContain("FREE");
    expect(html).toMatch(/class="[^"]*\bstamp\b/);
  });
});

describe("Ornament", () => {
  it("is decorative: hidden from assistive tech and carries the star", () => {
    const html = renderToStaticMarkup(h(Ornament, {}));
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain("✦");
  });
});
