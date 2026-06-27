// ─── Astrological polar coordinate system ───────────────────────────────────
//
// Mapping convention:
//   • Ascendant (ASC) is fixed at the 9 o'clock position → SVG angle 180°
//   • Zodiac increases counter-clockwise (opposite to SVG's clockwise default)
//   • Formula: svgAngle = 180° − (longitude − ascLongitude)
//
// SVG angle reference:
//   0°   = 3 o'clock  (east)
//   90°  = 6 o'clock  (south, y-down convention)
//   180° = 9 o'clock  (west)  ← ASC
//   270° = 12 o'clock (north)

import { normalizeAngle, polarToCartesian } from './geometry';
import type { Point } from './geometry';

/**
 * Convert an ecliptic longitude to an SVG angle, with the ASC
 * fixed at the 9 o'clock position (SVG 180°).
 *
 * @param longitude   Ecliptic longitude [0, 360)
 * @param ascLongitude Ascendant longitude (House 1 cusp longitude)
 * @returns SVG angle [0, 360)
 */
export function lonToSvgAngle(longitude: number, ascLongitude: number): number {
  return normalizeAngle(180 - (longitude - ascLongitude));
}

/**
 * Inverse: convert an SVG angle back to ecliptic longitude.
 */
export function svgAngleToLon(svgAngle: number, ascLongitude: number): number {
  return normalizeAngle(ascLongitude - svgAngle + 180);
}

/**
 * Return the (x, y) Cartesian point for a given ecliptic longitude and radius.
 */
export function lonToPoint(
  cx: number,
  cy: number,
  r: number,
  longitude: number,
  ascLongitude: number
): Point {
  return polarToCartesian(cx, cy, r, lonToSvgAngle(longitude, ascLongitude));
}

/**
 * Return the SVG angle for the midpoint of a zodiac sign (signStartLon + 15°).
 */
export function signMidSvgAngle(signStartLon: number, ascLongitude: number): number {
  return lonToSvgAngle(signStartLon + 15, ascLongitude);
}

/**
 * Return the SVG angle for the midpoint between two house cusps.
 * Handles the circular wraparound.
 */
export function houseMidSvgAngle(
  cusp1Lon: number,
  cusp2Lon: number,
  ascLongitude: number
): number {
  const span = normalizeAngle(cusp2Lon - cusp1Lon);
  const midLon = normalizeAngle(cusp1Lon + span / 2);
  return lonToSvgAngle(midLon, ascLongitude);
}

/**
 * Return the SVG angles (start, end) for an annular sector representing
 * a zodiac sign band.
 *
 * Since zodiac advances counter-clockwise:
 *   startSvgAngle corresponds to the sign's END longitude (higher lon → lower SVG angle)
 *   endSvgAngle   corresponds to the sign's START longitude
 *
 * The sector is drawn from startSvgAngle → endSvgAngle going counter-clockwise (sweep=0).
 */
export function signSectorAngles(
  signStartLon: number,
  ascLongitude: number
): { startSvgAngle: number; endSvgAngle: number } {
  return {
    startSvgAngle: lonToSvgAngle(signStartLon, ascLongitude),
    endSvgAngle: lonToSvgAngle(signStartLon + 30, ascLongitude),
  };
}

/**
 * Return the SVG angles for a house sector.
 */
export function houseSectorAngles(
  cusp1Lon: number,
  cusp2Lon: number,
  ascLongitude: number
): { startSvgAngle: number; endSvgAngle: number } {
  return {
    startSvgAngle: lonToSvgAngle(cusp1Lon, ascLongitude),
    endSvgAngle: lonToSvgAngle(cusp2Lon, ascLongitude),
  };
}
