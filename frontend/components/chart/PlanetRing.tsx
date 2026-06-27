// ─── Planet ring SVG component ───────────────────────────────────────────────
//
// Renders for each planet:
//   • Tick line from zodiac inner ring → planet track outer (at true ecliptic angle)
//   • Dashed leader line from ecliptic tick to glyph circle (when displaced)
//   • Glyph circle (filled dark, violet border / amber for retrograde)
//   • Unicode planet glyph inside circle
//   • Retrograde indicator (℞) for retrograde planets
//   • SVG <title> for hover tooltips

import React, { memo } from 'react';
import { fmt, toDMS } from '@/lib/chart/geometry';
import { CX, CY, R, PLANET_CIRCLE_R } from '@/lib/chart/constants';
import type { RenderedPlanet } from '@/lib/chart/renderer';

interface PlanetRingProps {
  planets: RenderedPlanet[];
  highlightPlanet?: string | null;
  onHover?: (planet: RenderedPlanet | null) => void;
}

export const PlanetRing = memo(function PlanetRing({
  planets,
  highlightPlanet,
  onHover,
}: PlanetRingProps) {
  return (
    <g id="planet-ring">
      {/* ── Planet track background rings ──────────────────────────────────── */}
      <circle
        cx={CX} cy={CY} r={R.PLANET_TRACK_OUTER}
        fill="rgba(10,10,30,0.40)"
        stroke="rgba(55,48,163,0.35)"
        strokeWidth={0.4}
      />
      <circle
        cx={CX} cy={CY} r={R.PLANET_TRACK_INNER}
        fill="none"
        stroke="rgba(55,48,163,0.25)"
        strokeWidth={0.4}
      />

      {/* ── Per-planet rendering ──────────────────────────────────────────── */}
      {planets.map((rp) => (
        <PlanetGlyph
          key={rp.planet.planet}
          rp={rp}
          dimmed={!!highlightPlanet && rp.planet.planet !== highlightPlanet}
          onHover={onHover}
        />
      ))}
    </g>
  );
});

// ── Individual planet glyph ───────────────────────────────────────────────────

interface PlanetGlyphProps {
  rp: RenderedPlanet;
  dimmed: boolean;
  onHover?: (planet: RenderedPlanet | null) => void;
}

const PlanetGlyph = memo(function PlanetGlyph({ rp, dimmed, onHover }: PlanetGlyphProps) {
  const {
    planet,
    glyphCenter,
    tickOuter,
    tickInner,
    needsLeaderLine,
    leaderTarget,
    glyph,
    isRetrograde,
  } = rp;

  const tooltipText = [
    planet.planet,
    `${planet.sign} ${toDMS(planet.longitude % 30)}`,
    `House ${planet.house_number}`,
    isRetrograde ? 'Retrograde ℞' : 'Direct',
  ].join(' · ');

  const glyphColor = isRetrograde ? '#f59e0b' : '#c4b5fd';
  const borderColor = isRetrograde
    ? 'rgba(245,158,11,0.75)'
    : 'rgba(139,92,246,0.75)';

  return (
    <g
      className="planet-group"
      style={{ cursor: 'pointer', opacity: dimmed ? 0.28 : 1, transition: 'opacity 0.2s' }}
      onMouseEnter={() => onHover?.(rp)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Eclipse tick line: zodiac inner ring → planet track outer */}
      <line
        x1={fmt(tickOuter.x)} y1={fmt(tickOuter.y)}
        x2={fmt(tickInner.x)} y2={fmt(tickInner.y)}
        stroke="rgba(167,139,250,0.45)"
        strokeWidth={0.8}
      />

      {/* Leader line: ecliptic tick → displaced glyph (dashed) */}
      {needsLeaderLine && (
        <line
          x1={fmt(tickInner.x)} y1={fmt(tickInner.y)}
          x2={fmt(leaderTarget.x)} y2={fmt(leaderTarget.y)}
          stroke="rgba(167,139,250,0.28)"
          strokeWidth={0.65}
          strokeDasharray="2.5 2"
        />
      )}

      {/* Glyph circle */}
      <circle
        cx={fmt(glyphCenter.x)}
        cy={fmt(glyphCenter.y)}
        r={PLANET_CIRCLE_R}
        fill="#090916"
        stroke={borderColor}
        strokeWidth={1.0}
      />

      {/* Planet glyph */}
      <text
        x={fmt(glyphCenter.x)}
        y={fmt(glyphCenter.y)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11.5"
        fill={glyphColor}
        style={{ userSelect: 'none', fontFamily: 'serif', fontWeight: '400' }}
      >
        {glyph}
        <title>{tooltipText}</title>
      </text>

      {/* Retrograde indicator ℞ */}
      {isRetrograde && (
        <text
          x={fmt(glyphCenter.x + PLANET_CIRCLE_R * 0.65)}
          y={fmt(glyphCenter.y - PLANET_CIRCLE_R * 0.65)}
          fontSize="5.5"
          fill="#f59e0b"
          fillOpacity={0.95}
          style={{ userSelect: 'none', fontFamily: 'serif' }}
        >
          ℞
        </text>
      )}
    </g>
  );
});
