// ─── Planet label collision avoidance ───────────────────────────────────────
//
// Algorithm: Iterative angular push-apart + radial stacking
//
// Phase 1 — Angular push-apart (iterative relaxation):
//   • Sort planets by ecliptic SVG angle.
//   • Repeat until stable (or maxIterations):
//     - For each adjacent pair, if angular gap < minSpacing, push them apart.
//     - Clamp displacement so we don't overshoot past neighbors.
//
// Phase 2 — Radial stacking:
//   • After angular relaxation, any two planets still < minSpacing * 0.6 apart
//     get alternate radial offsets so they visually stack inward/outward.
//
// Phase 3 — Leader line detection:
//   • Any planet whose display angle differs from ecliptic by > threshold,
//     or that has a radial offset, gets a leader line drawn.

import { normalizeAngle, angularDifference } from './geometry';
import { MIN_PLANET_SPACING_DEG } from './constants';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LayoutInput {
  /** Unique identifier (planet name). */
  id: string;
  /** True SVG angle derived from ecliptic longitude. */
  eclipticSvgAngle: number;
}

export interface LayoutResult {
  id: string;
  eclipticSvgAngle: number;
  /** Display angle (may differ from ecliptic if pushed apart). */
  displaySvgAngle: number;
  /**
   * Radial offset in pixels (positive = move toward center).
   * Applied when angular push alone isn't enough.
   */
  radialOffsetPx: number;
  /**
   * Whether a "leader line" should be drawn connecting the ecliptic tick
   * to the displaced glyph position.
   */
  needsLeaderLine: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const RADIAL_STEP_PX = 18;
const MAX_RADIAL_STACKS = 2;
const LEADER_THRESHOLD_DEG = 1.2;

// ─── Phase 1: iterative angular push-apart ───────────────────────────────────

function pushApart(
  items: { displaySvgAngle: number }[],
  minSpacing: number,
  maxIter: number
): void {
  const n = items.length;
  if (n <= 1) return;

  for (let iter = 0; iter < maxIter; iter++) {
    let moved = false;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const a = items[i].displaySvgAngle;
      const b = items[j].displaySvgAngle;

      // Smallest angular gap between these two items
      const gapCCW = normalizeAngle(a - b);
      const gapCW  = 360 - gapCCW;
      const gap = Math.min(gapCCW, gapCW);

      if (gap < minSpacing) {
        const push = (minSpacing - gap) / 2;
        const diff = angularDifference(a, b); // signed: from a toward b
        if (diff >= 0) {
          // b is ahead of a (CW), push a back (CW) and b forward (CW)
          items[i].displaySvgAngle = normalizeAngle(a - push);
          items[j].displaySvgAngle = normalizeAngle(b + push);
        } else {
          items[i].displaySvgAngle = normalizeAngle(a + push);
          items[j].displaySvgAngle = normalizeAngle(b - push);
        }
        moved = true;
      }
    }

    if (!moved) break;
  }
}

// ─── Phase 2: radial stacking for residual overlaps ──────────────────────────

function assignRadialOffsets(items: LayoutResult[], minSpacing: number): void {
  const n = items.length;

  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const a = items[i].displaySvgAngle;
    const b = items[j].displaySvgAngle;
    const gap = Math.min(normalizeAngle(a - b), normalizeAngle(b - a));

    if (gap < minSpacing * 0.6) {
      const currentStack = items[j].radialOffsetPx / RADIAL_STEP_PX;
      const nextStack = (currentStack + 1) % (MAX_RADIAL_STACKS + 1);
      items[j].radialOffsetPx = nextStack * RADIAL_STEP_PX;
    }
  }
}

// ─── Main entry point ─────────────────────────────────────────────────────────

/**
 * Given a list of planets with their ecliptic SVG angles, return a layout
 * where glyphs are separated by at least `minSpacing` degrees.
 *
 * @param inputs     Array of {id, eclipticSvgAngle}
 * @param minSpacing Minimum angular gap between display positions (default 13°)
 * @param maxIter    Push-apart iteration limit
 */
export function resolveCollisions(
  inputs: LayoutInput[],
  minSpacing = MIN_PLANET_SPACING_DEG,
  maxIter = 100
): LayoutResult[] {
  if (inputs.length === 0) return [];

  // Initialize results, sorted by ecliptic angle
  const items: LayoutResult[] = [...inputs]
    .sort((a, b) => a.eclipticSvgAngle - b.eclipticSvgAngle)
    .map((inp) => ({
      id: inp.id,
      eclipticSvgAngle: inp.eclipticSvgAngle,
      displaySvgAngle: inp.eclipticSvgAngle,
      radialOffsetPx: 0,
      needsLeaderLine: false,
    }));

  // Phase 1: angular push-apart
  pushApart(items, minSpacing, maxIter);

  // Phase 2: radial stacking for residual overlaps
  assignRadialOffsets(items, minSpacing);

  // Phase 3: mark which items need a leader line
  for (const item of items) {
    const angDelta = Math.abs(angularDifference(item.eclipticSvgAngle, item.displaySvgAngle));
    item.needsLeaderLine = angDelta > LEADER_THRESHOLD_DEG || item.radialOffsetPx > 0;
  }

  // Re-sort by original input order so callers get a stable order
  const inputOrder = new Map(inputs.map((inp, i) => [inp.id, i]));
  items.sort((a, b) => (inputOrder.get(a.id) ?? 0) - (inputOrder.get(b.id) ?? 0));

  return items;
}

// ─── Cluster detection (utility, used in tests) ───────────────────────────────

/**
 * Group planet indices into clusters where adjacent members are within
 * `threshold` degrees of each other (by ecliptic angle).
 */
export function detectClusters(angles: number[], threshold: number): number[][] {
  if (angles.length === 0) return [];

  const sorted = angles.map((a, i) => ({ a, i })).sort((x, y) => x.a - y.a);
  const clusters: number[][] = [[sorted[0].i]];

  for (let k = 1; k < sorted.length; k++) {
    const gap = normalizeAngle(sorted[k].a - sorted[k - 1].a);
    if (gap <= threshold) {
      clusters[clusters.length - 1].push(sorted[k].i);
    } else {
      clusters.push([sorted[k].i]);
    }
  }
  return clusters;
}
