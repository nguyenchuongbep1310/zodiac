"use client";

import { LearnPageLayout } from "@/components/landing/LearnPageLayout";

const articles = [
  {
    id: "sun-moon",
    title: "The Big Three: Sun, Moon, and Rising",
    excerpt:
      "Understand the three placements that shape your core identity, emotional world, and outward presence.",
    category: "basics" as const,
    readTime: "7 min",
    href: "/learn/birth-chart/sun-moon",
    featured: true,
  },
  {
    id: "planets",
    title: "The Planets in Astrology",
    excerpt:
      "A guide to each planet's role in your chart, from Mercury's communication style to Pluto's transformation.",
    category: "basics" as const,
    readTime: "9 min",
    href: "/learn/birth-chart/planets",
  },
];

export default function LearnPage() {
  return (
    <LearnPageLayout
      articles={articles}
      title="Learn Astrology"
      subtitle="Comprehensive Guides & Tutorials"
    />
  );
}
