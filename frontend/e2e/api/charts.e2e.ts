import { test, expect } from "@playwright/test";
import { CORE_PLANETS, SAMPLE_CHART } from "../fixtures";

// Requests go to the frontend origin, so they also exercise the Next.js
// "/api" rewrite that the browser uses to reach the Go backend.
const API = "/api/v1/charts";

test.describe("charts API (through the frontend proxy)", () => {
  test("backend is healthy", async ({ request }) => {
    const res = await request.get("http://localhost:8080/health");
    expect(res.ok()).toBeTruthy();
    expect(await res.json()).toEqual({ status: "ok" });
  });

  test("calculates a natal chart", async ({ request }) => {
    const res = await request.post(`${API}/calculate`, { data: SAMPLE_CHART });
    expect(res.status(), await res.text()).toBe(201);
    const chart = await res.json();

    expect(chart.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(chart.name).toBe(SAMPLE_CHART.name);
    expect(chart.house_system).toBe("placidus");
    expect(chart.planets.map((p: { planet: string }) => p.planet)).toEqual(expect.arrayContaining(CORE_PLANETS));
    expect(chart.houses).toHaveLength(12);
    expect(Array.isArray(chart.aspects)).toBeTruthy();

    for (const p of chart.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.house_number).toBeGreaterThanOrEqual(1);
      expect(p.house_number).toBeLessThanOrEqual(12);
    }
  });

  test("known reference chart: Sun in Scorpio on 1995-10-24", async ({ request }) => {
    const chart = await (await request.post(`${API}/calculate`, { data: SAMPLE_CHART })).json();
    const sun = chart.planets.find((p: { planet: string }) => p.planet === "Sun");
    expect(sun.sign).toBe("Scorpio");
  });

  test("each house system is accepted", async ({ request }) => {
    for (const house_system of ["placidus", "koch", "whole_sign", "equal"]) {
      const res = await request.post(`${API}/calculate`, { data: { ...SAMPLE_CHART, house_system } });
      expect(res.status(), house_system).toBe(201);
      expect((await res.json()).house_system).toBe(house_system);
    }
  });

  test("fetches a saved chart by id", async ({ request }) => {
    const created = await (await request.post(`${API}/calculate`, { data: SAMPLE_CHART })).json();
    const res = await request.get(`${API}/${created.id}`);
    expect(res.ok()).toBeTruthy();
    const chart = await res.json();
    expect(chart.id).toBe(created.id);
    expect(chart.planets).toHaveLength(created.planets.length);
  });

  test("returns interpretations in English and Vietnamese", async ({ request }) => {
    const { id } = await (await request.post(`${API}/calculate`, { data: SAMPLE_CHART })).json();
    for (const lang of ["en", "vi"]) {
      const res = await request.get(`${API}/${id}/interpretations?lang=${lang}`);
      expect(res.ok(), `${lang}: ${await res.text()}`).toBeTruthy();
    }
  });

  test("rejects invalid input with 422", async ({ request }) => {
    const cases = [
      { ...SAMPLE_CHART, birth_date: "24/10/1995" },
      { ...SAMPLE_CHART, birth_date: "1700-01-01" },
      { ...SAMPLE_CHART, latitude: 120 },
      { ...SAMPLE_CHART, house_system: "made_up" },
      { ...SAMPLE_CHART, name: "x".repeat(101) },
    ];
    for (const data of cases) {
      const res = await request.post(`${API}/calculate`, { data });
      expect(res.status(), JSON.stringify(data)).toBe(422);
      expect((await res.json()).code).toBe("VALIDATION_ERROR");
    }
  });

  test("unknown and malformed ids", async ({ request }) => {
    expect((await request.get(`${API}/00000000-0000-0000-0000-000000000000`)).status()).toBe(404);
    expect((await request.get(`${API}/not-a-uuid`)).status()).toBe(422);
  });
});
