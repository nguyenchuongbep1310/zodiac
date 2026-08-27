import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astromind.app";

const routes = [
  "",
  "/synastry",
  "/contact",
  "/privacy",
  "/terms",
  "/learn",
  "/learn/birth-chart/sun-moon",
  "/learn/birth-chart/planets",
  "/learn/synastry/basics",
  "/learn/synastry/venus-mars",
  "/learn/techniques/transits",
  "/learn/techniques/aspects",
  "/learn/techniques/progressions",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/learn" ? 0.8 : 0.6,
  }));
}
