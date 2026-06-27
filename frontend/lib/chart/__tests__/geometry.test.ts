import { describe, it, expect } from 'vitest';
import {
  normalizeAngle,
  angularDifference,
  angularDistance,
  wrapAngle180,
  polarToCartesian,
  cartesianToPolar,
  distance,
  midpoint,
  annularSector,
  arcPath,
  toDMS,
  lerp,
  clamp,
  rectsOverlap,
  centeredRect,
  fmt,
} from '../geometry';

// ─── normalizeAngle ───────────────────────────────────────────────────────────
describe('normalizeAngle', () => {
  it('keeps angles within [0, 360)', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(400)).toBeCloseTo(40);
    expect(normalizeAngle(-45)).toBeCloseTo(315);
    expect(normalizeAngle(-360)).toBe(0);
    expect(normalizeAngle(720)).toBe(0);
    expect(normalizeAngle(181)).toBeCloseTo(181);
  });
});

// ─── angularDifference ────────────────────────────────────────────────────────
describe('angularDifference', () => {
  it('returns the shortest signed path from a to b', () => {
    expect(angularDifference(10, 20)).toBeCloseTo(10);
    expect(angularDifference(350, 10)).toBeCloseTo(20);
    expect(angularDifference(10, 350)).toBeCloseTo(-20);
    expect(angularDifference(180, 0)).toBeCloseTo(180);
    expect(angularDifference(0, 180)).toBeCloseTo(180);
    expect(angularDifference(90, 270)).toBeCloseTo(180);
  });
});

// ─── angularDistance ─────────────────────────────────────────────────────────
describe('angularDistance', () => {
  it('always returns a non-negative value ≤ 180', () => {
    expect(angularDistance(0, 180)).toBe(180);
    expect(angularDistance(350, 10)).toBeCloseTo(20);
    expect(angularDistance(10, 350)).toBeCloseTo(20);
    expect(angularDistance(0, 0)).toBe(0);
  });
});

// ─── wrapAngle180 ─────────────────────────────────────────────────────────────
describe('wrapAngle180', () => {
  it('wraps to [-180, 180)', () => {
    expect(wrapAngle180(0)).toBe(0);
    expect(wrapAngle180(180)).toBe(-180);
    expect(wrapAngle180(270)).toBeCloseTo(-90);
    expect(wrapAngle180(-90)).toBeCloseTo(-90);
    expect(wrapAngle180(90)).toBeCloseTo(90);
  });
});

// ─── polarToCartesian ─────────────────────────────────────────────────────────
describe('polarToCartesian', () => {
  it("converts 0° (3 o'clock) correctly", () => {
    const pt = polarToCartesian(0, 0, 100, 0);
    expect(pt.x).toBeCloseTo(100);
    expect(pt.y).toBeCloseTo(0);
  });

  it("converts 90° (6 o'clock, y-down) correctly", () => {
    const pt = polarToCartesian(0, 0, 100, 90);
    expect(pt.x).toBeCloseTo(0);
    expect(pt.y).toBeCloseTo(100);
  });

  it("converts 180° (9 o'clock, ASC) correctly", () => {
    const pt = polarToCartesian(0, 0, 100, 180);
    expect(pt.x).toBeCloseTo(-100);
    expect(pt.y).toBeCloseTo(0, 5);
  });

  it("converts 270° (12 o'clock) correctly", () => {
    const pt = polarToCartesian(0, 0, 100, 270);
    expect(pt.x).toBeCloseTo(0, 5);
    expect(pt.y).toBeCloseTo(-100);
  });

  it('respects center offset', () => {
    const pt = polarToCartesian(50, 60, 100, 0);
    expect(pt.x).toBeCloseTo(150);
    expect(pt.y).toBeCloseTo(60);
  });
});

// ─── cartesianToPolar ─────────────────────────────────────────────────────────
describe('cartesianToPolar', () => {
  it('converts a 45° point correctly', () => {
    const pol = cartesianToPolar(100, 100);
    expect(pol.r).toBeCloseTo(141.421, 2);
    expect(pol.angleDeg).toBeCloseTo(45);
  });

  it('round-trips with polarToCartesian', () => {
    const orig = polarToCartesian(0, 0, 150, 37);
    const polar = cartesianToPolar(orig.x, orig.y);
    expect(polar.r).toBeCloseTo(150, 2);
    expect(polar.angleDeg).toBeCloseTo(37, 2);
  });
});

// ─── distance ─────────────────────────────────────────────────────────────────
describe('distance', () => {
  it('computes Euclidean distance', () => {
    expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBeCloseTo(5);
    expect(distance({ x: 1, y: 1 }, { x: 1, y: 1 })).toBe(0);
  });
});

// ─── midpoint ─────────────────────────────────────────────────────────────────
describe('midpoint', () => {
  it('returns the midpoint between two points', () => {
    const m = midpoint({ x: 0, y: 0 }, { x: 10, y: 20 });
    expect(m.x).toBe(5);
    expect(m.y).toBe(10);
  });
});

// ─── toDMS ────────────────────────────────────────────────────────────────────
describe('toDMS', () => {
  it('formats 0 degrees', () => {
    expect(toDMS(0)).toBe('0°00\'00"');
  });

  it('formats a common degree', () => {
    // 15.5° = 15° 30' 00"
    expect(toDMS(15.5)).toBe('15°30\'00"');
  });

  it('formats 29°59\'59"', () => {
    const deg = 29 + 59 / 60 + 59 / 3600;
    expect(toDMS(deg)).toBe('29°59\'59"');
  });
});

// ─── lerp ─────────────────────────────────────────────────────────────────────
describe('lerp', () => {
  it('interpolates linearly', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.3)).toBeCloseTo(13);
  });
});

// ─── clamp ────────────────────────────────────────────────────────────────────
describe('clamp', () => {
  it('clamps values within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(0, 0, 0)).toBe(0);
  });
});

// ─── rectsOverlap ─────────────────────────────────────────────────────────────
describe('rectsOverlap', () => {
  const a = { x: 0, y: 0, w: 10, h: 10 };

  it('detects overlapping rects', () => {
    expect(rectsOverlap(a, { x: 5, y: 5, w: 10, h: 10 })).toBe(true);
  });

  it('detects non-overlapping rects', () => {
    expect(rectsOverlap(a, { x: 15, y: 0, w: 10, h: 10 })).toBe(false);
  });

  it('treats touching edges as non-overlapping', () => {
    expect(rectsOverlap(a, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
  });

  it('uses padding correctly', () => {
    // With padding 3, x=10 rect should now overlap a=0..10 padded to 0..13
    expect(rectsOverlap(a, { x: 11, y: 0, w: 10, h: 10 }, 3)).toBe(true);
  });
});

// ─── centeredRect ─────────────────────────────────────────────────────────────
describe('centeredRect', () => {
  it('centers a rect at a point', () => {
    const r = centeredRect(10, 20, 6, 4);
    expect(r.x).toBe(7);
    expect(r.y).toBe(18);
    expect(r.w).toBe(6);
    expect(r.h).toBe(4);
  });
});

// ─── fmt ─────────────────────────────────────────────────────────────────────
describe('fmt', () => {
  it('formats to 2 decimal places', () => {
    expect(fmt(3.14159)).toBe('3.14');
    expect(fmt(0)).toBe('0.00');
    expect(fmt(-1.235)).toBe('-1.24');
  });
});

// ─── annularSector ────────────────────────────────────────────────────────────
describe('annularSector', () => {
  it('returns a non-empty path string', () => {
    const path = annularSector(250, 250, 100, 200, 0, 90);
    expect(path).toContain('M');
    expect(path).toContain('A');
    expect(path).toContain('Z');
  });

  it('starts at the outer radius at startDeg', () => {
    const path = annularSector(0, 0, 50, 100, 0, 90);
    // First M point should be (100, 0) for 0° in SVG convention
    expect(path).toMatch(/^M 100\.00 0\.00/);
  });
});

// ─── arcPath ─────────────────────────────────────────────────────────────────
describe('arcPath', () => {
  it('returns a valid SVG path string', () => {
    const p = arcPath(0, 0, 100, 0, 90);
    expect(p).toContain('M');
    expect(p).toContain('A');
  });

  it('uses large-arc flag correctly for > 180° span', () => {
    // A 270° arc going CW should have large-arc=1
    const p = arcPath(0, 0, 100, 0, 270, 1);
    expect(p).toContain(' 1 1 '); // large=1, sweep=1
  });
});
