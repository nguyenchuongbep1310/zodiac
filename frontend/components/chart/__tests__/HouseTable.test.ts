import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

// HouseTable reads the locale through next/navigation; outside a Next app there is no router.
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {} }), usePathname: () => "/" }));

import { HouseTable } from "../HouseTable";

const interpretations = {
  house_in_sign: [
    { house_number: 1, interpretation: { core_meaning: "CORE1", real_life: "REAL1", strengths: "STR1", challenges: "CHAL1" } },
    { house_number: 2, interpretation: { core_meaning: "CORE2", real_life: "REAL2", strengths: "STR2", challenges: "CHAL2" } },
  ],
} as never;

const render = (house_number: number, withInterpretations = true) =>
  renderToStaticMarkup(
    h(HouseTable, {
      houses: [{ house_number, cusp_longitude: 15, sign: "Aries" }],
      interpretations: withInterpretations ? interpretations : undefined,
    }),
  );

describe("HouseTable colours (retro theme)", () => {
  it("emphasises angular houses 1/4/7/10 with the primary colour", () => {
    expect(render(1)).toContain("text-[var(--am-primary)]");
    expect(render(7)).toContain("text-[var(--am-primary)]");
  });

  it("does not emphasise ordinary houses", () => {
    expect(render(2, false)).not.toContain("text-[var(--am-primary)]");
  });

  it("writes interpretation copy in ink/muted, never teal (teal is for accents)", () => {
    expect(render(2)).not.toContain("--am-teal");
  });

  it("draws the number box with an ink border like the planet and aspect tables", () => {
    expect(render(2)).toMatch(/border-2 border-\[var\(--am-edge\)\][^"]*shrink-0|shrink-0[^"]*border-2 border-\[var\(--am-edge\)\]/);
  });
});
