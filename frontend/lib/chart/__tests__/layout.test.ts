import { describe, it, expect } from 'vitest';
import { resolveCollisions, detectClusters } from '../layout';
import type { LayoutInput } from '../layout';

// ─── resolveCollisions ────────────────────────────────────────────────────────
describe('resolveCollisions', () => {
  it('returns empty array for empty input', () => {
    expect(resolveCollisions([])).toEqual([]);
  });

  it('returns single item with correct id and display angle', () => {
    const input: LayoutInput[] = [{ id: 'Sun', eclipticSvgAngle: 45 }];
    const result = resolveCollisions(input);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('Sun');
    expect(result[0].displaySvgAngle).toBeCloseTo(45);
    expect(result[0].eclipticSvgAngle).toBeCloseTo(45);
  });

  it('preserves well-separated planets without modification', () => {
    // 30° apart — well above 13° minimum
    const inputs: LayoutInput[] = [
      { id: 'Sun',  eclipticSvgAngle: 0   },
      { id: 'Moon', eclipticSvgAngle: 30  },
      { id: 'Mars', eclipticSvgAngle: 60  },
      { id: 'Jupiter', eclipticSvgAngle: 90 },
    ];
    const results = resolveCollisions(inputs);
    results.forEach((r, i) => {
      expect(r.displaySvgAngle).toBeCloseTo(inputs[i].eclipticSvgAngle, 0);
      expect(r.needsLeaderLine).toBe(false);
    });
  });

  it('separates two overlapping planets to at least minSpacing', () => {
    const MIN = 13;
    const inputs: LayoutInput[] = [
      { id: 'Sun',  eclipticSvgAngle: 100 },
      { id: 'Moon', eclipticSvgAngle: 104 }, // only 4° apart
    ];
    const results = resolveCollisions(inputs, MIN);
    expect(results).toHaveLength(2);

    const angles = results.map((r) => r.displaySvgAngle);
    const gap = Math.min(
      Math.abs(angles[0] - angles[1]),
      360 - Math.abs(angles[0] - angles[1])
    );
    expect(gap).toBeGreaterThanOrEqual(MIN - 0.5); // allow tiny fp error
  });

  it('marks displaced planets as needing a leader line', () => {
    const inputs: LayoutInput[] = [
      { id: 'Sun',  eclipticSvgAngle: 100 },
      { id: 'Moon', eclipticSvgAngle: 102 },
    ];
    const results = resolveCollisions(inputs);
    // At least one should need a leader line
    const anyLeader = results.some((r) => r.needsLeaderLine);
    expect(anyLeader).toBe(true);
  });

  it('handles a tight cluster of 5 planets', () => {
    const MIN = 13;
    const inputs: LayoutInput[] = [
      { id: 'A', eclipticSvgAngle: 180 },
      { id: 'B', eclipticSvgAngle: 182 },
      { id: 'C', eclipticSvgAngle: 184 },
      { id: 'D', eclipticSvgAngle: 186 },
      { id: 'E', eclipticSvgAngle: 188 },
    ];
    const results = resolveCollisions(inputs, MIN);
    expect(results).toHaveLength(5);

    // All display angles should be in [0, 360)
    results.forEach((r) => {
      expect(r.displaySvgAngle).toBeGreaterThanOrEqual(0);
      expect(r.displaySvgAngle).toBeLessThan(360);
    });
  });

  it('preserves original input order in output', () => {
    const inputs: LayoutInput[] = [
      { id: 'C', eclipticSvgAngle: 90  },
      { id: 'A', eclipticSvgAngle: 0   },
      { id: 'B', eclipticSvgAngle: 180 },
    ];
    const results = resolveCollisions(inputs);
    expect(results[0].id).toBe('C');
    expect(results[1].id).toBe('A');
    expect(results[2].id).toBe('B');
  });
});

// ─── detectClusters ──────────────────────────────────────────────────────────
describe('detectClusters', () => {
  it('returns empty for empty input', () => {
    expect(detectClusters([], 10)).toEqual([]);
  });

  it('groups adjacent angles within threshold into a cluster', () => {
    const angles = [0, 5, 10, 90, 95]; // two clusters: [0,5,10] and [90,95]
    const clusters = detectClusters(angles, 10);
    expect(clusters).toHaveLength(2);
    // Each cluster is an array of original indices
    expect(clusters[0]).toHaveLength(3);
    expect(clusters[1]).toHaveLength(2);
  });

  it('treats each well-separated angle as its own cluster', () => {
    const angles = [0, 90, 180, 270];
    const clusters = detectClusters(angles, 10);
    expect(clusters).toHaveLength(4);
    clusters.forEach((c) => expect(c).toHaveLength(1));
  });

  it('handles a single angle as a single cluster', () => {
    const clusters = detectClusters([45], 10);
    expect(clusters).toHaveLength(1);
    expect(clusters[0]).toContain(0);
  });
});
