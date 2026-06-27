// ─── House ring SVG component ────────────────────────────────────────────────
//
// Renders:
//   • House band background (annular ring)
//   • House cusp radial lines (angular houses highlighted in amber)
//   • Roman numeral house labels at midpoints
//   • Axis labels (ASC / IC / DSC / MC) for angular houses

import React, { memo } from 'react';
import { polarToCartesian, fmt } from '@/lib/chart/geometry';
import { CX, CY, R, ROMAN, AXIS_LABEL } from '@/lib/chart/constants';
import type { RenderedHouse } from '@/lib/chart/renderer';

interface HouseRingProps {
  houses: RenderedHouse[];
}

export const HouseRing = memo(function HouseRing({ houses }: HouseRingProps) {
  return (
    <g id="house-ring">
      {/* ── House band background ─────────────────────────────────────────── */}
      <circle cx={CX} cy={CY} r={R.HOUSE_OUTER} fill="rgba(8,8,22,0.55)" />
      <circle
        cx={CX} cy={CY} r={R.HOUSE_INNER}
        fill="rgba(4,4,14,0.75)"
        stroke="rgba(55,48,163,0.45)"
        strokeWidth={0.5}
      />

      {/* ── House cusp lines ──────────────────────────────────────────────── */}
      {houses.map(({ house, cuspSvgAngle, isAngular }) => {
        const outer = polarToCartesian(CX, CY, R.HOUSE_OUTER, cuspSvgAngle);
        const inner = polarToCartesian(CX, CY, R.HOUSE_INNER, cuspSvgAngle);
        return (
          <line
            key={`cusp-${house.house_number}`}
            x1={fmt(outer.x)} y1={fmt(outer.y)}
            x2={fmt(inner.x)} y2={fmt(inner.y)}
            stroke={isAngular ? '#f59e0b' : 'rgba(40,40,100,0.85)'}
            strokeWidth={isAngular ? 1.6 : 0.7}
            strokeLinecap="round"
          />
        );
      })}

      {/* ── House number labels ───────────────────────────────────────────── */}
      {houses.map(({ house, labelPos, isAngular }) => (
        <text
          key={`label-${house.house_number}`}
          x={fmt(labelPos.x)}
          y={fmt(labelPos.y)}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={isAngular ? '8' : '7'}
          fontWeight={isAngular ? '700' : '400'}
          fill={isAngular ? '#fbbf24' : 'rgba(120,120,180,0.85)'}
          style={{ userSelect: 'none', fontFamily: 'var(--font-sans, sans-serif)' }}
        >
          {ROMAN[house.house_number]}
        </text>
      ))}

      {/* ── Axis labels (ASC / IC / DSC / MC) ────────────────────────────── */}
      {houses
        .filter((h) => h.isAngular)
        .map(({ house, cuspSvgAngle }) => {
          const labelR = R.HOUSE_OUTER + 13;
          const pos = polarToCartesian(CX, CY, labelR, cuspSvgAngle);
          return (
            <text
              key={`axis-${house.house_number}`}
              x={fmt(pos.x)}
              y={fmt(pos.y)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="6"
              fontWeight="700"
              fill="#f59e0b"
              fillOpacity={0.85}
              letterSpacing="0.06em"
              style={{
                userSelect: 'none',
                fontFamily: 'var(--font-sans, sans-serif)',
                textTransform: 'uppercase',
              }}
            >
              {AXIS_LABEL[house.house_number]}
            </text>
          );
        })}
    </g>
  );
});
