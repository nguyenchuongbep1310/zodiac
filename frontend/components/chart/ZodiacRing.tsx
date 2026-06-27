// ─── Zodiac band ring SVG component ─────────────────────────────────────────
//
// Renders:
//   • 12 annular sector paths colored by element
//   • Zodiac sign glyph at sector midpoint
//   • Degree tick marks (1°, 5°, 10°, 30°)
//   • Sign boundary radial lines

import React, { memo } from 'react';
import { polarToCartesian, fmt } from '@/lib/chart/geometry';
import { CX, CY, R } from '@/lib/chart/constants';
import type { RenderedZodiacSign, DegreeTickMark } from '@/lib/chart/renderer';

interface ZodiacRingProps {
  signs: RenderedZodiacSign[];
  ticks: DegreeTickMark[];
}

export const ZodiacRing = memo(function ZodiacRing({ signs, ticks }: ZodiacRingProps) {
  return (
    <g id="zodiac-ring">
      {/* ── Background fill ────────────────────────────────────────────────── */}
      <circle cx={CX} cy={CY} r={R.ZODIAC_OUTER} fill="rgba(6,6,20,0.95)" />

      {/* ── Sector fills ─────────────────────────────────────────────────── */}
      {signs.map(({ sign, sectorPath, fill, borderColor }) => (
        <path
          key={sign.name}
          d={sectorPath}
          fill={fill}
          stroke={borderColor}
          strokeWidth={0.4}
        />
      ))}

      {/* ── Outer border circle ───────────────────────────────────────────── */}
      <circle
        cx={CX} cy={CY} r={R.ZODIAC_OUTER}
        fill="none"
        stroke="rgba(55,48,163,0.8)"
        strokeWidth={1}
      />

      {/* ── Inner border circle ───────────────────────────────────────────── */}
      <circle
        cx={CX} cy={CY} r={R.ZODIAC_INNER}
        fill="none"
        stroke="rgba(55,48,163,0.5)"
        strokeWidth={0.6}
      />

      {/* ── Sign boundary lines ───────────────────────────────────────────── */}
      {signs.map(({ sign, startSvgAngle }) => {
        const outer = polarToCartesian(CX, CY, R.ZODIAC_OUTER, startSvgAngle);
        const inner = polarToCartesian(CX, CY, R.ZODIAC_INNER, startSvgAngle);
        return (
          <line
            key={`boundary-${sign.name}`}
            x1={fmt(outer.x)} y1={fmt(outer.y)}
            x2={fmt(inner.x)} y2={fmt(inner.y)}
            stroke="rgba(55,48,163,0.7)"
            strokeWidth={0.7}
          />
        );
      })}

      {/* ── Degree tick marks ─────────────────────────────────────────────── */}
      {ticks.map((tick, i) => {
        const outer = polarToCartesian(CX, CY, R.TICK_BASE, tick.svgAngle);
        const inner = polarToCartesian(CX, CY, tick.innerR, tick.svgAngle);
        return (
          <line
            key={i}
            x1={fmt(outer.x)} y1={fmt(outer.y)}
            x2={fmt(inner.x)} y2={fmt(inner.y)}
            stroke="rgba(200,200,255,0.9)"
            strokeWidth={tick.strokeWidth}
            strokeOpacity={tick.opacity}
          />
        );
      })}

      {/* ── Zodiac sign glyphs ─────────────────────────────────────────────── */}
      {signs.map(({ sign, glyphPos, glyphColor }) => (
        <text
          key={`glyph-${sign.name}`}
          x={fmt(glyphPos.x)}
          y={fmt(glyphPos.y)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="14"
          fill={glyphColor}
          style={{ userSelect: 'none', fontFamily: 'serif', fontWeight: '400' }}
        >
          {sign.glyph}
        </text>
      ))}
    </g>
  );
});
