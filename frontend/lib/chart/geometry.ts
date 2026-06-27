// ─── Pure geometry utilities for the natal chart renderer ──────────────────
// All functions are pure and unit-testable (no DOM/React dependencies).

export const DEG_TO_RAD = Math.PI / 180;
export const RAD_TO_DEG = 180 / Math.PI;
export const TWO_PI = 2 * Math.PI;

// ─── Point type ──────────────────────────────────────────────────────────────

export interface Point {
  readonly x: number;
  readonly y: number;
}

// ─── Angle utilities ─────────────────────────────────────────────────────────

/**
 * Normalize any angle (in degrees) into [0, 360).
 */
export function normalizeAngle(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Signed angular difference going from `a` to `b` (shortest path).
 * Result is in (-180, 180].
 */
export function angularDifference(a: number, b: number): number {
  const diff = normalizeAngle(b - a);
  return diff > 180 ? diff - 360 : diff;
}

/**
 * Absolute angular distance between two angles (always positive, ≤ 180).
 */
export function angularDistance(a: number, b: number): number {
  return Math.abs(angularDifference(a, b));
}

/**
 * Wrap an angle to [-180, 180).
 */
export function wrapAngle180(deg: number): number {
  const n = normalizeAngle(deg);
  return n >= 180 ? n - 360 : n;
}

// ─── Coordinate conversions ───────────────────────────────────────────────────

/**
 * Convert polar coordinates (angle in degrees, SVG convention where 0° = 3 o'clock,
 * increasing clockwise) to Cartesian (x, y).
 */
export function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
): Point {
  const rad = angleDeg * DEG_TO_RAD;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/**
 * Convert Cartesian offset from center to polar angle (SVG convention).
 */
export function cartesianToPolar(dx: number, dy: number): { r: number; angleDeg: number } {
  return {
    r: Math.sqrt(dx * dx + dy * dy),
    angleDeg: normalizeAngle(Math.atan2(dy, dx) * RAD_TO_DEG),
  };
}

// ─── Distance ────────────────────────────────────────────────────────────────

export function distance(a: Point, b: Point): number {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
}

export function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

// ─── SVG path builders ───────────────────────────────────────────────────────

/**
 * Build an SVG arc path string (open, not closed).
 * Sweep 1 = clockwise, 0 = counter-clockwise (SVG convention).
 */
export function arcPath(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
  sweep: 0 | 1 = 1
): string {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const spanCW = normalizeAngle(endDeg - startDeg);
  const spanUsed = sweep === 1 ? spanCW : 360 - spanCW;
  const large = spanUsed > 180 ? 1 : 0;
  return `M ${fmt(s.x)} ${fmt(s.y)} A ${r} ${r} 0 ${large} ${sweep} ${fmt(e.x)} ${fmt(e.y)}`;
}

/**
 * Build a closed annular sector (wedge between two radii, from startDeg to endDeg,
 * going counter-clockwise — matching the astrological convention where increasing
 * longitude travels counterclockwise in SVG space).
 *
 * Produces: outer arc CCW → inner arc CW → closed.
 */
export function annularSector(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startDeg: number,
  endDeg: number
): string {
  const os = polarToCartesian(cx, cy, outerR, startDeg);
  const oe = polarToCartesian(cx, cy, outerR, endDeg);
  const is_ = polarToCartesian(cx, cy, innerR, startDeg);
  const ie = polarToCartesian(cx, cy, innerR, endDeg);

  const spanCCW = normalizeAngle(startDeg - endDeg);
  const largeOuter = spanCCW > 180 ? 1 : 0;
  const largeInner = spanCCW > 180 ? 1 : 0;

  return [
    `M ${fmt(os.x)} ${fmt(os.y)}`,
    `A ${outerR} ${outerR} 0 ${largeOuter} 0 ${fmt(oe.x)} ${fmt(oe.y)}`,
    `L ${fmt(ie.x)} ${fmt(ie.y)}`,
    `A ${innerR} ${innerR} 0 ${largeInner} 1 ${fmt(is_.x)} ${fmt(is_.y)}`,
    'Z',
  ].join(' ');
}

/**
 * Build a radial line path between two radii at the given angle.
 */
export function radialLine(
  cx: number,
  cy: number,
  r1: number,
  r2: number,
  angleDeg: number
): string {
  const p1 = polarToCartesian(cx, cy, r1, angleDeg);
  const p2 = polarToCartesian(cx, cy, r2, angleDeg);
  return `M ${fmt(p1.x)} ${fmt(p1.y)} L ${fmt(p2.x)} ${fmt(p2.y)}`;
}

// ─── Number formatting ────────────────────────────────────────────────────────

/** Format a floating-point number for SVG attributes (2 decimal places). */
export function fmt(n: number): string {
  return n.toFixed(2);
}

// ─── Bounding box ─────────────────────────────────────────────────────────────

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function rectsOverlap(a: Rect, b: Rect, padding = 0): boolean {
  return (
    a.x - padding < b.x + b.w + padding &&
    a.x + a.w + padding > b.x - padding &&
    a.y - padding < b.y + b.h + padding &&
    a.y + a.h + padding > b.y - padding
  );
}

/** Center a rect at a given point. */
export function centeredRect(cx: number, cy: number, w: number, h: number): Rect {
  return { x: cx - w / 2, y: cy - h / 2, w, h };
}

// ─── Degree → DMS string ──────────────────────────────────────────────────────

export function toDMS(deg: number): string {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const m = Math.floor((abs - d) * 60);
  const s = Math.round(((abs - d) * 60 - m) * 60);
  return `${d}°${String(m).padStart(2, '0')}'${String(s).padStart(2, '0')}"`;
}

// ─── Linear interpolation ─────────────────────────────────────────────────────

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Clamp n between lo and hi. */
export function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}
