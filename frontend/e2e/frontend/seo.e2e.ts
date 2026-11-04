import { test, expect } from "../fixtures";

const pages = [
  { path: "/", vi: "/vi" },
  { path: "/learn", vi: "/vi/learn" },
  { path: "/learn/birth-chart/sun-moon", vi: "/vi/learn/birth-chart/sun-moon" },
  { path: "/synastry", vi: "/vi/synastry" },
  { path: "/contact", vi: "/vi/contact" },
];

function head(html: string) {
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  const alt = (lang: string) => html.match(new RegExp(`<link rel="alternate" hrefLang="${lang}" href="([^"]+)"`))?.[1];
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  return { canonical, en: alt("en"), vi: alt("vi"), xDefault: alt("x-default"), title, description };
}

test.describe("SEO tags", () => {
  for (const { path, vi } of pages) {
    test(`${path} has canonical, hreflang and its own title`, async ({ request }) => {
      const en = head(await (await request.get(path)).text());
      const viHead = head(await (await request.get(vi)).text());

      expect(new URL(en.canonical!).pathname.replace(/\/$/, "") || "/").toBe(path);
      expect(new URL(viHead.canonical!).pathname).toBe(vi);

      // Both versions point at each other, plus an x-default.
      for (const h of [en, viHead]) {
        expect(new URL(h.en!).pathname.replace(/\/$/, "") || "/").toBe(path);
        expect(new URL(h.vi!).pathname).toBe(vi);
        expect(h.xDefault).toBe(h.en);
      }

      expect(en.title).toBeTruthy();
      expect(viHead.title).toBeTruthy();
      expect(viHead.title).not.toBe(en.title);
      expect(en.description?.length).toBeGreaterThan(50);
      expect(viHead.description?.length).toBeGreaterThan(50);
    });
  }

  test("homepage ships FAQ and WebSite structured data", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const blocks = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
    const types = blocks.flatMap((b) => (b["@graph"] ?? [b]).map((n: { "@type": string }) => n["@type"]));
    expect(types).toEqual(expect.arrayContaining(["WebSite", "FAQPage", "WebApplication"]));
  });

  test("sitemap lists both languages with alternates", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/vi/learn/birth-chart/sun-moon</loc>");
    expect(xml).toMatch(/hreflang="vi"/);
    expect(xml).toMatch(/hreflang="x-default"/);
  });

  test("robots blocks personal chart pages in both languages", async ({ request }) => {
    const txt = await (await request.get("/robots.txt")).text();
    expect(txt).toContain("Disallow: /charts/");
    expect(txt).toContain("Disallow: /vi/charts/");
  });

  test("Open Graph image renders", async ({ request }) => {
    const res = await request.get("/opengraph-image");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  });
});
