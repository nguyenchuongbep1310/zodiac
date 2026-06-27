// ─── Chart rendering engine ──────────────────────────────────────────────────
//
// Takes raw ChartResponse from the API and produces all geometry needed
// by the SVG components. Pure data transformation — no React, no DOM.

import type {
  ChartResponse,
  PlanetPositionResponse,
  HouseCuspResponse,
  AspectResponse,
} from '@/lib/types/api';
import {
  lonToSvgAngle,
  signSectorAngles,
  signMidSvgAngle,
  houseMidSvgAngle,
} from './polar';
import {
  polarToCartesian,
  normalizeAngle,
  toDMS,
  annularSector,
} from './geometry';
import { resolveCollisions } from './layout';
import type { LayoutResult } from './layout';
import {
  CX, CY, R,
  ZODIAC_SIGNS,
  PLANET_GLYPH,
  PLANET_ABBR,
  ASPECT_STYLE,
  ELEMENT_FILL,
  ANGULAR_HOUSES,
  PLANET_CIRCLE_R,
} from './constants';
import type { ZodiacSignMeta } from './constants';
import type { Point } from './geometry';

// ─── Output types ─────────────────────────────────────────────────────────────

export interface RenderedZodiacSign {
  sign: ZodiacSignMeta;
  /** SVG annular sector path (outer zodiac band) */
  sectorPath: string;
  /** Center point for the sign glyph */
  glyphPos: Point;
  /** SVG angle of sign start cusp line */
  startSvgAngle: number;
  /** SVG angle of sign end cusp line */
  endSvgAngle: number;
  fill: string;
  glyphColor: string;
  borderColor: string;
}

export interface RenderedHouse {
  house: HouseCuspResponse;
  /** SVG angle of this house's cusp line */
  cuspSvgAngle: number;
  /** Midpoint SVG angle for house number label */
  midSvgAngle: number;
  labelPos: Point;
  isAngular: boolean;
}

export interface RenderedPlanet {
  planet: PlanetPositionResponse;
  /** SVG angle derived from true longitude */
  eclipticSvgAngle: number;
  /** Display SVG angle (may differ after collision avoidance) */
  displaySvgAngle: number;
  /** Center of the glyph circle (displaced position) */
  glyphCenter: Point;
  /** Point where tick meets the zodiac inner ring */
  tickOuter: Point;
  /** Point where tick ends (near planet track outer) */
  tickInner: Point;
  /** Draw a leader line from tickInner to glyphCenter when offset */
  needsLeaderLine: boolean;
  /** Leader line destination (edge of glyph circle at display angle) */
  leaderTarget: Point;
  glyph: string;
  abbr: string;
  /** Display label: "☉ 12°34'00"" style */
  label: string;
  isRetrograde: boolean;
}

export interface RenderedAspect {
  aspect: AspectResponse;
  p1: Point;
  p2: Point;
  style: typeof ASPECT_STYLE[string];
}

export interface DegreeTickMark {
  /** SVG angle */
  svgAngle: number;
  /** Tick inner radius (outer is always TICK_BASE) */
  innerR: number;
  /** Stroke width */
  strokeWidth: number;
  /** Stroke opacity */
  opacity: number;
}

export interface ChartRenderData {
  ascLongitude: number;
  zodiacSigns: RenderedZodiacSign[];
  houses: RenderedHouse[];
  planets: RenderedPlanet[];
  aspects: RenderedAspect[];
  degreeTicks: DegreeTickMark[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildDegreeTicks(ascLongitude: number): DegreeTickMark[] {
  const ticks: DegreeTickMark[] = [];
  for (let deg = 0; deg < 360; deg++) {
    const svgAngle = lonToSvgAngle(deg, ascLongitude);
    const is30 = deg % 30 === 0;
    const is10 = deg % 10 === 0;
    const is5  = deg % 5  === 0;

    if (is30) {
      ticks.push({ svgAngle, innerR: R.TICK_30, strokeWidth: 1.2, opacity: 0.80 });
    } else if (is10) {
      ticks.push({ svgAngle, innerR: R.TICK_10, strokeWidth: 0.8, opacity: 0.55 });
    } else if (is5) {
      ticks.push({ svgAngle, innerR: R.TICK_5,  strokeWidth: 0.6, opacity: 0.40 });
    } else {
      ticks.push({ svgAngle, innerR: R.TICK_1,  strokeWidth: 0.4, opacity: 0.22 });
    }
  }
  return ticks;
}

function buildZodiacSigns(ascLongitude: number): RenderedZodiacSign[] {
  return ZODIAC_SIGNS.map((sign) => {
    const { startSvgAngle, endSvgAngle } = signSectorAngles(sign.startLon, ascLongitude);
    const glyphAngle = signMidSvgAngle(sign.startLon, ascLongitude);
    const glyphPos = polarToCartesian(
      CX, CY,
      (R.ZODIAC_OUTER + R.ZODIAC_INNER) / 2,
      glyphAngle
    );
    const ec = ELEMENT_FILL[sign.element];

    return {
      sign,
      sectorPath: annularSector(CX, CY, R.ZODIAC_INNER, R.ZODIAC_OUTER, startSvgAngle, endSvgAngle),
      glyphPos,
      startSvgAngle,
      endSvgAngle,
      fill: ec.sector,
      glyphColor: ec.glyph,
      borderColor: ec.border,
    };
  });
}

function buildHouses(chart: ChartResponse, ascLongitude: number): RenderedHouse[] {
  return chart.houses.map((house, i) => {
    const nextHouse = chart.houses[(i + 1) % chart.houses.length];
    const cuspSvgAngle = lonToSvgAngle(house.cusp_longitude, ascLongitude);
    const midSvgAngle  = houseMidSvgAngle(
      house.cusp_longitude,
      nextHouse.cusp_longitude,
      ascLongitude
    );
    const labelPos = polarToCartesian(CX, CY, R.HOUSE_LABEL, midSvgAngle);

    return {
      house,
      cuspSvgAngle,
      midSvgAngle,
      labelPos,
      isAngular: ANGULAR_HOUSES.has(house.house_number),
    };
  });
}

function buildPlanets(chart: ChartResponse, ascLongitude: number): RenderedPlanet[] {
  // Step 1: compute ecliptic SVG angles for all planets
  const layoutInputs = chart.planets.map((p) => ({
    id: p.planet,
    eclipticSvgAngle: lonToSvgAngle(p.longitude, ascLongitude),
  }));

  // Step 2: run collision avoidance
  const layoutMap = new Map<string, LayoutResult>(
    resolveCollisions(layoutInputs).map((r) => [r.id, r])
  );

  // Step 3: build full render objects
  return chart.planets.map((planet) => {
    const layout = layoutMap.get(planet.planet)!;
    const glyphR = R.PLANET_GLYPH - layout.radialOffsetPx;

    const glyphCenter = polarToCartesian(CX, CY, glyphR, layout.displaySvgAngle);
    const tickOuter   = polarToCartesian(CX, CY, R.PLANET_TICK_FROM, layout.eclipticSvgAngle);
    const tickInner   = polarToCartesian(CX, CY, R.PLANET_TICK_TO,   layout.eclipticSvgAngle);

    // Leader line: goes from tickInner to the near edge of the glyph circle
    const leaderTarget = polarToCartesian(
      CX, CY,
      glyphR + PLANET_CIRCLE_R + 1,
      layout.displaySvgAngle
    );

    const glyph = PLANET_GLYPH[planet.planet] ?? planet.planet[0];
    const abbr  = PLANET_ABBR[planet.planet]  ?? planet.planet.slice(0, 2);

    // Sign-relative degree label
    const signDeg = planet.longitude % 30;
    const label = `${glyph} ${toDMS(signDeg)}${planet.is_retrograde ? ' ℞' : ''}`;

    return {
      planet,
      eclipticSvgAngle: layout.eclipticSvgAngle,
      displaySvgAngle:  layout.displaySvgAngle,
      glyphCenter,
      tickOuter,
      tickInner,
      needsLeaderLine: layout.needsLeaderLine,
      leaderTarget,
      glyph,
      abbr,
      label,
      isRetrograde: planet.is_retrograde,
    };
  });
}

function buildAspects(
  chart: ChartResponse,
  planets: RenderedPlanet[]
): RenderedAspect[] {
  // Lookup ecliptic SVG angle by planet name
  const angleMap = new Map(planets.map((p) => [p.planet.planet, p.eclipticSvgAngle]));

  return chart.aspects
    .filter((aspect) => angleMap.has(aspect.planet_1) && angleMap.has(aspect.planet_2))
    .map((aspect) => {
      const a1 = angleMap.get(aspect.planet_1)!;
      const a2 = angleMap.get(aspect.planet_2)!;
      const style = ASPECT_STYLE[aspect.aspect_type] ?? ASPECT_STYLE['_default'];
      return {
        aspect,
        p1: polarToCartesian(CX, CY, R.ASPECT_RING, a1),
        p2: polarToCartesian(CX, CY, R.ASPECT_RING, a2),
        style,
      };
    });
}

// ─── Main API ─────────────────────────────────────────────────────────────────

/**
 * Transform a raw ChartResponse into all data needed for SVG rendering.
 * This is the single entry point consumed by ChartWheel.
 */
export function buildChartRenderData(chart: ChartResponse): ChartRenderData {
  const ascLongitude = chart.houses[0]?.cusp_longitude ?? 0;
  const zodiacSigns  = buildZodiacSigns(ascLongitude);
  const houses       = buildHouses(chart, ascLongitude);
  const planets      = buildPlanets(chart, ascLongitude);
  const aspects      = buildAspects(chart, planets);
  const degreeTicks  = buildDegreeTicks(ascLongitude);

  return { ascLongitude, zodiacSigns, houses, planets, aspects, degreeTicks };
}
