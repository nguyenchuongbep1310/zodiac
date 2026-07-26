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
  highlightHouse?: number | null;
  onHover?: (house: RenderedHouse | null) => void;
  onClick?: (house: RenderedHouse) => void;
}

export const HouseRing = memo(function HouseRing({ 
  houses,
  highlightHouse,
  onHover,
  onClick,
}: HouseRingProps) {
  return (
    <g id="house-ring">
      {/* ── House band background ─────────────────────────────────────────── */}
      <circle cx={CX} cy={CY} r={R.HOUSE_OUTER} fill="var(--wheel-house-outer)" />
      <circle
        cx={CX} cy={CY} r={R.HOUSE_INNER}
        fill="var(--wheel-house-inner)"
        stroke="var(--wheel-house-stroke)"
        strokeWidth={0.5}
      />

      {/* ── House groups (lines & labels) ──────────────────────────────────── */}
      {houses.map((renderedHouse) => {
        const { house, cuspSvgAngle, labelPos, isAngular } = renderedHouse;
        const outer = polarToCartesian(CX, CY, R.HOUSE_OUTER, cuspSvgAngle);
        const inner = polarToCartesian(CX, CY, R.HOUSE_INNER, cuspSvgAngle);
        
        const isHighlighted = highlightHouse === house.house_number;
        const isDimmed = highlightHouse !== null && highlightHouse !== undefined && !isHighlighted;

        return (
          <g
            key={`house-group-${house.house_number}`}
            className="house-group group"
            style={{ 
              cursor: 'pointer', 
              opacity: isDimmed ? 0.35 : 1, 
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={() => onHover?.(renderedHouse)}
            onMouseLeave={() => onHover?.(null)}
            onClick={() => onClick?.(renderedHouse)}
          >
            {/* Invisible thicker line for easier hovering */}
            <line
              x1={fmt(outer.x)} y1={fmt(outer.y)}
              x2={fmt(inner.x)} y2={fmt(inner.y)}
              stroke="transparent"
              strokeWidth={8}
            />
            {/* Visible cusp line */}
            <line
              x1={fmt(outer.x)} y1={fmt(outer.y)}
              x2={fmt(inner.x)} y2={fmt(inner.y)}
              stroke={isAngular ? '#f59e0b' : 'var(--wheel-house-stroke)'}
              strokeWidth={isAngular ? 1.6 : 0.7}
              strokeLinecap="round"
              className="group-hover:stroke-amber-400 group-hover:stroke-[2px] transition-all"
            />

            {/* Roman numeral label */}
            <text
              x={fmt(labelPos.x)}
              y={fmt(labelPos.y)}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={isAngular ? '8' : '7'}
              fontWeight={isAngular ? '700' : '400'}
              fill={isAngular ? '#f59e0b' : 'var(--wheel-text-dim)'}
              style={{ userSelect: 'none', fontFamily: 'var(--font-sans, sans-serif)' }}
              className="group-hover:fill-amber-400 transition-colors"
            >
              {ROMAN[house.house_number]}
            </text>

            {/* Axis label if angular */}
            {isAngular && (
              <text
                x={fmt(polarToCartesian(CX, CY, R.HOUSE_OUTER + 13, cuspSvgAngle).x)}
                y={fmt(polarToCartesian(CX, CY, R.HOUSE_OUTER + 13, cuspSvgAngle).y)}
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
                className="group-hover:fill-amber-300 transition-colors"
              >
                {AXIS_LABEL[house.house_number]}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
});
