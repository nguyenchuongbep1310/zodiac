import { describe, it, expect } from 'vitest';
import { lonToSvgAngle, svgAngleToLon, signSectorAngles, houseSectorAngles } from '../polar';

describe('Polar coordinate helpers', () => {

  describe('lonToSvgAngle', () => {
    it("places ASC (asc longitude) at SVG 180° (9 o'clock)", () => {
      const asc = 45;
      expect(lonToSvgAngle(asc, asc)).toBeCloseTo(180);
    });

    it("places the opposite point (DSC = asc + 180°) at SVG 0° (3 o'clock)", () => {
      const asc = 45;
      expect(lonToSvgAngle(asc + 180, asc)).toBeCloseTo(0);
    });

    it("places MC (asc + 90°) at SVG 270° (12 o'clock, top)", () => {
      const asc = 0;
      // MC is 90° ahead of ASC in zodiac (counter-clockwise)
      // svgAngle = 180 - (90 - 0) = 90 → wait, 12 o'clock = 270° SVG
      // Actually: MC is the 10th house cusp. With asc=0, MC ≈ 270 ecliptic
      // lonToSvgAngle(270, 0) = 180 - (270 - 0) = -90 → normalize → 270
      expect(lonToSvgAngle(270, 0)).toBeCloseTo(270);
    });

    it('returns a value in [0, 360)', () => {
      for (let lon = 0; lon < 360; lon += 15) {
        const angle = lonToSvgAngle(lon, 0);
        expect(angle).toBeGreaterThanOrEqual(0);
        expect(angle).toBeLessThan(360);
      }
    });

    it('is the inverse of svgAngleToLon', () => {
      const asc = 123;
      for (let lon = 0; lon < 360; lon += 30) {
        const svgAngle = lonToSvgAngle(lon, asc);
        const roundTrip = svgAngleToLon(svgAngle, asc);
        expect(roundTrip).toBeCloseTo(lon, 4);
      }
    });
  });

  describe('svgAngleToLon', () => {
    it('recovers the longitude from a SVG angle', () => {
      const asc = 30;
      const lon = 75;
      const svgAngle = lonToSvgAngle(lon, asc);
      expect(svgAngleToLon(svgAngle, asc)).toBeCloseTo(lon, 4);
    });
  });

  describe('signSectorAngles', () => {
    it('returns two angles spanning exactly 30° (one sign)', () => {
      const asc = 0;
      const { startSvgAngle, endSvgAngle } = signSectorAngles(0, asc);
      // Aries spans 0°-30° ecliptic
      // startSvgAngle = lonToSvgAngle(0, 0)  = 180
      // endSvgAngle   = lonToSvgAngle(30, 0) = 150
      expect(startSvgAngle).toBeCloseTo(180);
      expect(endSvgAngle).toBeCloseTo(150);
    });

    it('handles the Pisces sign correctly (wraps at 360°)', () => {
      const asc = 0;
      const { startSvgAngle, endSvgAngle } = signSectorAngles(330, asc);
      // Pisces: 330°-360°
      // startSvgAngle = lonToSvgAngle(330, 0) = 180 - 330 = -150 → 210
      // endSvgAngle   = lonToSvgAngle(360, 0) = lonToSvgAngle(0, 0) = 180
      expect(startSvgAngle).toBeCloseTo(210);
      expect(endSvgAngle).toBeCloseTo(180);
    });
  });

  describe('houseSectorAngles', () => {
    it('returns SVG angles for a house sector', () => {
      const asc = 0;
      const { startSvgAngle, endSvgAngle } = houseSectorAngles(0, 30, asc);
      expect(startSvgAngle).toBeCloseTo(180);
      expect(endSvgAngle).toBeCloseTo(150);
    });
  });
});
