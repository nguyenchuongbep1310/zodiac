import { test as base, expect } from "@playwright/test";

/**
 * Shared test fixture. City search calls OpenStreetMap Nominatim from the
 * browser; blocking it makes the app fall back to its built-in city list, so
 * tests don't depend on a third-party service or its rate limits.
 */
export const test = base.extend({
  // The fixture callback is conventionally called `use`; renamed so the React
  // hooks lint rule doesn't mistake it for React's use().
  page: async ({ page }, provide) => {
    await page.route("https://nominatim.openstreetmap.org/**", (route) => route.abort());
    await provide(page);
  },
});

export { expect };

export const SAMPLE_CHART = {
  name: "E2E Test",
  birth_date: "1995-10-24",
  birth_time: "08:30",
  timezone: "Asia/Ho_Chi_Minh",
  latitude: 21.0285,
  longitude: 105.8542,
  city: "Hà Nội",
  house_system: "placidus",
} as const;

/** Every planet the backend returns for a natal chart, by English name. */
export const CORE_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];
