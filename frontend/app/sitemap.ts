import type { MetadataRoute } from "next";
import { locales, localePath } from "@/lib/i18n/locale";
import { absoluteUrl, learnArticles } from "@/lib/seo";

const routes = [
  "/",
  "/synastry",
  "/learn",
  ...Object.values(learnArticles).map((a) => a.path),
  "/contact",
  "/privacy",
  "/terms",
];

function priority(route: string) {
  if (route === "/") return 1;
  if (route === "/synastry" || route === "/learn") return 0.8;
  if (route.startsWith("/learn/")) return 0.7;
  return 0.3;
}

// One entry per locale, each listing every language version so search engines
// can pair them up (the sitemap form of hreflang).
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    const languages = Object.fromEntries(locales.map((l) => [l, absoluteUrl(localePath(l, route))]));
    return locales.map((locale) => ({
      url: absoluteUrl(localePath(locale, route)),
      lastModified: new Date(),
      changeFrequency: route === "/" ? "weekly" : "monthly",
      priority: priority(route),
      alternates: { languages: { ...languages, "x-default": languages.en } },
    }));
  });
}
