import { describe, it, expect } from 'vitest';
import { buildChartRenderData } from '../renderer';
import type { ChartResponse } from '@/lib/types/api';

// ─── Minimal chart fixture ────────────────────────────────────────────────────

const MOCK_CHART: ChartResponse = {
  id: 'test-chart',
  name: 'Test Chart',
  birth_date: '2000-01-01',
  birth_time: '12:00',
  timezone: 'UTC',
  latitude: 0,
  longitude: 0,
  city: 'Test City',
  house_system: 'placidus',
  zodiac_system: 'tropical',
  is_rectified: false,
  created_at: '2024-01-01T00:00:00Z',
  planets: [
    { planet: 'Sun',     longitude: 350.5, latitude: 0,    speed: 1.0, is_retrograde: false, sign: 'Pisces',  house_number: 1 },
    { planet: 'Moon',    longitude: 45.2,  latitude: 0.1,  speed: 13,  is_retrograde: false, sign: 'Taurus',  house_number: 3 },
    { planet: 'Mercury', longitude: 340.1, latitude: 0.2,  speed: 1.2, is_retrograde: true,  sign: 'Pisces',  house_number: 12 },
    { planet: 'Venus',   longitude: 15.7,  latitude: -0.1, speed: 1.1, is_retrograde: false, sign: 'Aries',   house_number: 2 },
    { planet: 'Mars',    longitude: 222.0, latitude: 0.3,  speed: 0.6, is_retrograde: false, sign: 'Scorpio', house_number: 8 },
    { planet: 'Jupiter', longitude: 89.5,  latitude: 0.05, speed: 0.2, is_retrograde: false, sign: 'Gemini',  house_number: 4 },
    { planet: 'Saturn',  longitude: 352.8, latitude: 0.1,  speed: 0.1, is_retrograde: false, sign: 'Pisces',  house_number: 1 },
  ],
  houses: [
    { house_number: 1,  cusp_longitude: 330.0, sign: 'Pisces' },
    { house_number: 2,  cusp_longitude: 0.0,   sign: 'Aries' },
    { house_number: 3,  cusp_longitude: 30.0,  sign: 'Taurus' },
    { house_number: 4,  cusp_longitude: 60.0,  sign: 'Gemini' },
    { house_number: 5,  cusp_longitude: 90.0,  sign: 'Cancer' },
    { house_number: 6,  cusp_longitude: 120.0, sign: 'Leo' },
    { house_number: 7,  cusp_longitude: 150.0, sign: 'Virgo' },
    { house_number: 8,  cusp_longitude: 180.0, sign: 'Libra' },
    { house_number: 9,  cusp_longitude: 210.0, sign: 'Scorpio' },
    { house_number: 10, cusp_longitude: 240.0, sign: 'Sagittarius' },
    { house_number: 11, cusp_longitude: 270.0, sign: 'Capricorn' },
    { house_number: 12, cusp_longitude: 300.0, sign: 'Aquarius' },
  ],
  aspects: [
    { planet_1: 'Sun', planet_2: 'Moon',    aspect_type: 'trine',       orb: 1.2, is_applying: true },
    { planet_1: 'Sun', planet_2: 'Saturn',  aspect_type: 'conjunction', orb: 2.3, is_applying: false },
    { planet_1: 'Moon', planet_2: 'Mars',   aspect_type: 'square',      orb: 3.2, is_applying: true },
    { planet_1: 'Mercury', planet_2: 'Venus', aspect_type: 'sextile',   orb: 1.8, is_applying: false },
    { planet_1: 'Sun', planet_2: 'Jupiter', aspect_type: 'opposition',  orb: 0.9, is_applying: true },
  ],
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('buildChartRenderData', () => {
  const data = buildChartRenderData(MOCK_CHART);

  // ── ascLongitude ─────────────────────────────────────────────────────────
  it('sets ascLongitude from house 1 cusp', () => {
    expect(data.ascLongitude).toBe(330.0);
  });

  // ── zodiacSigns ──────────────────────────────────────────────────────────
  it('renders all 12 zodiac signs', () => {
    expect(data.zodiacSigns).toHaveLength(12);
  });

  it('all zodiac signs have non-empty sector paths', () => {
    data.zodiacSigns.forEach((z) => {
      expect(z.sectorPath).toBeTruthy();
      expect(z.sectorPath).toContain('M');
    });
  });

  it('all zodiac signs have a valid glyph position', () => {
    data.zodiacSigns.forEach((z) => {
      expect(typeof z.glyphPos.x).toBe('number');
      expect(typeof z.glyphPos.y).toBe('number');
      expect(isFinite(z.glyphPos.x)).toBe(true);
      expect(isFinite(z.glyphPos.y)).toBe(true);
    });
  });

  // ── houses ───────────────────────────────────────────────────────────────
  it('renders all 12 houses', () => {
    expect(data.houses).toHaveLength(12);
  });

  it('marks angular houses 1, 4, 7, 10 as isAngular', () => {
    const angularNumbers = new Set([1, 4, 7, 10]);
    data.houses.forEach((h) => {
      expect(h.isAngular).toBe(angularNumbers.has(h.house.house_number));
    });
  });

  it('ASC cusp (house 1) is placed at SVG angle 180°', () => {
    const house1 = data.houses.find((h) => h.house.house_number === 1)!;
    expect(house1.cuspSvgAngle).toBeCloseTo(180, 3);
  });

  // ── planets ──────────────────────────────────────────────────────────────
  it('renders all input planets', () => {
    expect(data.planets).toHaveLength(MOCK_CHART.planets.length);
  });

  it('all planets have valid glyph centers (finite numbers)', () => {
    data.planets.forEach((p) => {
      expect(isFinite(p.glyphCenter.x)).toBe(true);
      expect(isFinite(p.glyphCenter.y)).toBe(true);
    });
  });

  it('retrograde planets are marked correctly', () => {
    const mercury = data.planets.find((p) => p.planet.planet === 'Mercury')!;
    expect(mercury.isRetrograde).toBe(true);
    const sun = data.planets.find((p) => p.planet.planet === 'Sun')!;
    expect(sun.isRetrograde).toBe(false);
  });

  it('all planets have non-empty glyphs', () => {
    data.planets.forEach((p) => {
      expect(p.glyph.length).toBeGreaterThan(0);
    });
  });

  it('all planet ecliptic SVG angles are in [0, 360)', () => {
    data.planets.forEach((p) => {
      expect(p.eclipticSvgAngle).toBeGreaterThanOrEqual(0);
      expect(p.eclipticSvgAngle).toBeLessThan(360);
    });
  });

  it('collision avoidance keeps display angles in [0, 360)', () => {
    data.planets.forEach((p) => {
      expect(p.displaySvgAngle).toBeGreaterThanOrEqual(0);
      expect(p.displaySvgAngle).toBeLessThan(360);
    });
  });

  it('clustered planets (Sun/Saturn near 350°) do not overlap after layout', () => {
    const sun     = data.planets.find((p) => p.planet.planet === 'Sun')!;
    const saturn  = data.planets.find((p) => p.planet.planet === 'Saturn')!;
    const mercury = data.planets.find((p) => p.planet.planet === 'Mercury')!;

    // All three are within 13° of each other ecliptically (350.5, 352.8, 340.1)
    // After layout, display angles should be spread at least ~10° apart
    const angles = [sun, saturn, mercury].map((p) => p.displaySvgAngle).sort((a, b) => a - b);
    for (let i = 0; i < angles.length - 1; i++) {
      const gap = angles[i + 1] - angles[i];
      // Accept gaps ≥ 8° (some tolerance for clustering edge cases)
      expect(gap + (gap < 0 ? 360 : 0)).toBeGreaterThanOrEqual(8);
    }
  });

  // ── aspects ──────────────────────────────────────────────────────────────
  it('renders all valid aspects', () => {
    expect(data.aspects).toHaveLength(MOCK_CHART.aspects.length);
  });

  it('each aspect has a style with color and opacity', () => {
    data.aspects.forEach((a) => {
      expect(a.style.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(a.style.opacity).toBeGreaterThan(0);
      expect(a.style.opacity).toBeLessThanOrEqual(1);
    });
  });

  it('trine aspect uses blue color', () => {
    const trine = data.aspects.find((a) => a.aspect.aspect_type === 'trine')!;
    expect(trine.style.color).toBe('#3b82f6');
  });

  it('square aspect uses red color', () => {
    const square = data.aspects.find((a) => a.aspect.aspect_type === 'square')!;
    expect(square.style.color).toBe('#ef4444');
  });

  it('opposition aspect uses dark red color', () => {
    const opp = data.aspects.find((a) => a.aspect.aspect_type === 'opposition')!;
    expect(opp.style.color).toBe('#dc2626');
  });

  it('conjunction aspect uses gray color', () => {
    const conj = data.aspects.find((a) => a.aspect.aspect_type === 'conjunction')!;
    expect(conj.style.color).toBe('#9ca3af');
  });

  it('aspect endpoints are valid finite points', () => {
    data.aspects.forEach((a) => {
      expect(isFinite(a.p1.x)).toBe(true);
      expect(isFinite(a.p1.y)).toBe(true);
      expect(isFinite(a.p2.x)).toBe(true);
      expect(isFinite(a.p2.y)).toBe(true);
    });
  });

  // ── degreeTicks ──────────────────────────────────────────────────────────
  it('renders exactly 360 degree ticks', () => {
    expect(data.degreeTicks).toHaveLength(360);
  });

  it('all tick marks have valid SVG angles', () => {
    data.degreeTicks.forEach((t) => {
      expect(t.svgAngle).toBeGreaterThanOrEqual(0);
      expect(t.svgAngle).toBeLessThan(360);
    });
  });
});
