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
import { useTranslation } from '@/lib/hooks/useI18n';

interface PlanetRingProps {
  planets: RenderedPlanet[];
  highlightPlanet?: string | null;
  onHover?: (planet: RenderedPlanet | null) => void;
  onClick?: (planet: RenderedPlanet) => void;
}

export const PlanetRing = memo(function PlanetRing({
  planets,
  highlightPlanet,
  onHover,
  onClick,
}: PlanetRingProps) {
  return (
    <g id="planet-ring">
      {/* ── Planet track background rings ──────────────────────────────────── */}
      <circle
        cx={CX} cy={CY} r={R.PLANET_TRACK_OUTER}
        fill="var(--wheel-planet-track-outer)"
        stroke="var(--wheel-planet-track-inner)"
        strokeWidth={0.4}
      />
      <circle
        cx={CX} cy={CY} r={R.PLANET_TRACK_INNER}
        fill="none"
        stroke="var(--wheel-planet-track-inner)"
        strokeWidth={0.4}
      />

      {/* ── Per-planet rendering ──────────────────────────────────────────── */}
      {planets.map((rp) => (
        <PlanetGlyph
          key={rp.planet.planet}
          rp={rp}
          dimmed={!!highlightPlanet && rp.planet.planet !== highlightPlanet}
          onHover={onHover}
          onClick={onClick}
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
  onClick?: (planet: RenderedPlanet) => void;
}

const PlanetGlyph = memo(function PlanetGlyph({ rp, dimmed, onHover, onClick }: PlanetGlyphProps) {
  const { t } = useTranslation();
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

  const pKey = planet.planet.toLowerCase().replace(" ", "_");
  const sKey = planet.sign.toLowerCase();
  const pName = t(`planet.${pKey}`);
  const sName = t(`sign.${sKey}`);
  const houseText = `${t("table.house")} ${planet.house_number}`;
  const statusText = isRetrograde ? `℞ ${t("status.retrograde")}` : t("status.direct");

  const tooltipText = [
    pName,
    `${sName} ${toDMS(planet.longitude % 30)}`,
    houseText,
    statusText,
  ].join(' · ');

  const glyphColor = isRetrograde ? 'var(--am-sunset)' : 'var(--wheel-text-glyph)';
  const borderColor = isRetrograde
    ? 'var(--am-sunset)'
    : 'var(--wheel-border)';

  return (
    <g
      className="planet-group group"
      style={{ 
        cursor: 'pointer', 
        opacity: dimmed ? 0.28 : 1, 
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        transformOrigin: `${fmt(glyphCenter.x)}px ${fmt(glyphCenter.y)}px`
      }}
      onMouseEnter={(e) => {
        onHover?.(rp);
        e.currentTarget.style.transform = 'scale(1.2)';
      }}
      onMouseLeave={(e) => {
        onHover?.(null);
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={() => onClick?.(rp)}
    >
      {/* Eclipse tick line: zodiac inner ring → planet track outer */}
      <line
        x1={fmt(tickOuter.x)} y1={fmt(tickOuter.y)}
        x2={fmt(tickInner.x)} y2={fmt(tickInner.y)}
        stroke="var(--wheel-border-inner)"
        strokeWidth={0.8}
      />

      {/* Leader line: ecliptic tick → displaced glyph (dashed) */}
      {needsLeaderLine && (
        <line
          x1={fmt(tickInner.x)} y1={fmt(tickInner.y)}
          x2={fmt(leaderTarget.x)} y2={fmt(leaderTarget.y)}
          stroke="var(--wheel-border-inner)"
          strokeWidth={0.65}
          strokeDasharray="2.5 2"
        />
      )}

      {/* Glyph circle */}
      <circle
        cx={fmt(glyphCenter.x)}
        cy={fmt(glyphCenter.y)}
        r={PLANET_CIRCLE_R}
        fill="var(--wheel-planet-bg)"
        stroke={borderColor}
        strokeWidth={1.0}
        className="transition-all"
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
          fill="var(--am-sunset)"
          fillOpacity={0.95}
          style={{ userSelect: 'none', fontFamily: 'serif' }}
        >
          ℞
        </text>
      )}
    </g>
  );
});
