// ─── Synastry — cross-chart aspect & house-overlay calculations ────────────
// Pure functions, no DOM/React dependencies (mirrors lib/chart/geometry.ts).
//
// A synastry chart compares two natal charts by finding aspects between
// Person A's planets and Person B's planets (rather than within one chart),
// and by checking which of Person B's houses each of Person A's planets
// falls into (and vice versa).

import type { ChartResponse, AspectResponse } from "@/lib/types/api";
import { angularDistance, normalizeAngle } from "./geometry";

// ─── Aspect definitions ──────────────────────────────────────────────────────

export interface AspectDef {
  type: string;
  angle: number;
  orb: number;
}

/** Major + minor aspects considered for synastry, with default max orb (degrees). */
export const SYNASTRY_ASPECTS: AspectDef[] = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "opposition", angle: 180, orb: 8 },
  { type: "trine", angle: 120, orb: 7 },
  { type: "square", angle: 90, orb: 7 },
  { type: "sextile", angle: 60, orb: 5 },
  { type: "quincunx", angle: 150, orb: 3 },
  { type: "semisquare", angle: 45, orb: 2 },
  { type: "sesquiquadrate", angle: 135, orb: 2 },
];

/** Planets to skip for synastry aspect-grid noise reduction (nodes/lilith still shown). */
const DEFAULT_PLANETS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto", "North Node", "South Node", "Chiron", "Lilith",
];

export interface SynastryAspect extends AspectResponse {
  /** Which side each planet belongs to — needed since planet names collide across charts. */
  side_1: "A" | "B";
  side_2: "A" | "B";
}

/**
 * Compute every A-planet ↔ B-planet aspect within orb.
 * planet_1 is always the Person A planet, planet_2 is always Person B's.
 */
export function computeSynastryAspects(
  chartA: ChartResponse,
  chartB: ChartResponse,
  planets: string[] = DEFAULT_PLANETS
): SynastryAspect[] {
  const aPlanets = chartA.planets.filter((p) => planets.includes(p.planet));
  const bPlanets = chartB.planets.filter((p) => planets.includes(p.planet));

  const results: SynastryAspect[] = [];

  for (const a of aPlanets) {
    for (const b of bPlanets) {
      const dist = angularDistance(a.longitude, b.longitude);

      let best: { def: AspectDef; orb: number } | null = null;
      for (const def of SYNASTRY_ASPECTS) {
        const delta = Math.abs(dist - def.angle);
        if (delta <= def.orb && (!best || delta < best.orb)) {
          best = { def, orb: delta };
        }
      }

      if (best) {
        results.push({
          planet_1: a.planet,
          planet_2: b.planet,
          aspect_type: best.def.type,
          orb: best.orb,
          is_applying: a.speed !== b.speed ? a.speed > b.speed : false,
          side_1: "A",
          side_2: "B",
        });
      }
    }
  }

  // Tightest orb first — most significant connections surface at the top.
  return results.sort((x, y) => x.orb - y.orb);
}

// ─── House overlays ──────────────────────────────────────────────────────────

export interface HouseOverlay {
  planet: string;
  /** House number (1-12) of the *host* chart that this planet falls into. */
  house_number: number;
}

/**
 * For each planet in `guest`, find which house of `host` it occupies.
 * Used both directions: A's planets in B's houses, and B's planets in A's houses.
 */
export function computeHouseOverlays(
  guest: ChartResponse,
  host: ChartResponse,
  planets: string[] = DEFAULT_PLANETS
): HouseOverlay[] {
  const cusps = [...host.houses].sort((h1, h2) => h1.house_number - h2.house_number);
  if (cusps.length !== 12) return [];

  return guest.planets
    .filter((p) => planets.includes(p.planet))
    .map((p) => ({
      planet: p.planet,
      house_number: findHouseForLongitude(p.longitude, cusps.map((c) => c.cusp_longitude)),
    }));
}

/** Given 12 house cusp longitudes (in order) and a target longitude, find its house (1-12). */
function findHouseForLongitude(lon: number, cusps: number[]): number {
  const target = normalizeAngle(lon);
  for (let i = 0; i < 12; i++) {
    const start = normalizeAngle(cusps[i]);
    const end = normalizeAngle(cusps[(i + 1) % 12]);
    const span = normalizeAngle(end - start) || 360;
    const offset = normalizeAngle(target - start);
    if (offset < span) return i + 1;
  }
  return 1;
}

// ─── Summary scoring (lightweight, for the dashboard "compatibility" hint) ──

const WEIGHT: Record<string, number> = {
  conjunction: 3,
  trine: 3,
  sextile: 2,
  square: -2,
  opposition: -1.5,
  quincunx: -1,
  semisquare: -0.5,
  sesquiquadrate: -0.5,
};

/** Simple, transparent 0-100 "connection strength" score — not a compatibility verdict. */
export function scoreSynastry(aspects: SynastryAspect[]): number {
  if (aspects.length === 0) return 50;
  const raw = aspects.reduce((sum, a) => {
    const w = WEIGHT[a.aspect_type] ?? 0;
    const closeness = 1 - a.orb / 8; // tighter orb = more weight
    return sum + w * Math.max(closeness, 0.15);
  }, 0);
  const normalized = 50 + (raw / aspects.length) * 18;
  return Math.max(5, Math.min(95, Math.round(normalized)));
}
