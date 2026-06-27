// ─── Aspect lines SVG component ──────────────────────────────────────────────
//
// Renders connecting lines inside the chart for each aspect.
//
// Color convention (per spec):
//   Blue  → trine (#3b82f6), sextile (#60a5fa)
//   Red   → square (#ef4444), opposition (#dc2626)
//   Gray  → conjunction (#9ca3af)
//
// Additional aspects use muted secondary colors.
// Each aspect type has its own dash pattern and opacity.
//
// When `highlightPlanet` is set, non-involved aspects are dimmed.

import React, { memo } from 'react';
import { fmt } from '@/lib/chart/geometry';
import type { RenderedAspect } from '@/lib/chart/renderer';

interface AspectLinesProps {
  aspects: RenderedAspect[];
  /** When set, only full-opacity aspects involving this planet name */
  highlightPlanet?: string | null;
}

export const AspectLines = memo(function AspectLines({
  aspects,
  highlightPlanet,
}: AspectLinesProps) {
  // Two-pass rendering: dimmed first (back), highlighted on top
  const dimmed: RenderedAspect[] = [];
  const highlighted: RenderedAspect[] = [];

  for (const a of aspects) {
    const isActive =
      !highlightPlanet ||
      a.aspect.planet_1 === highlightPlanet ||
      a.aspect.planet_2 === highlightPlanet;
    (isActive ? highlighted : dimmed).push(a);
  }

  return (
    <g id="aspect-lines">
      {/* Dimmed aspects (back layer) */}
      {dimmed.map((ra, i) => (
        <AspectLine key={`d-${i}`} ra={ra} dimFactor={0.18} />
      ))}
      {/* Highlighted / all aspects (front layer) */}
      {highlighted.map((ra, i) => (
        <AspectLine key={`h-${i}`} ra={ra} dimFactor={1} />
      ))}
    </g>
  );
});

// ── Single aspect line ────────────────────────────────────────────────────────

interface AspectLineProps {
  ra: RenderedAspect;
  dimFactor: number;
}

const AspectLine = memo(function AspectLine({ ra, dimFactor }: AspectLineProps) {
  const { p1, p2, style, aspect } = ra;
  const opacity = style.opacity * dimFactor;
  const dashArray = style.dash === 'none' ? undefined : style.dash;

  const tooltipText = `${aspect.planet_1} ${style.label ?? aspect.aspect_type} ${aspect.planet_2} (orb ${aspect.orb.toFixed(1)}°)`;

  return (
    <line
      x1={fmt(p1.x)} y1={fmt(p1.y)}
      x2={fmt(p2.x)} y2={fmt(p2.y)}
      stroke={style.color}
      strokeWidth={style.width}
      strokeOpacity={opacity}
      strokeDasharray={dashArray}
      strokeLinecap="round"
    >
      <title>{tooltipText}</title>
    </line>
  );
});
