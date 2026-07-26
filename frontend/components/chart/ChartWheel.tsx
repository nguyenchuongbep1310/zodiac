"use client";

// ─── Natal Chart Wheel — main SVG renderer ───────────────────────────────────
//
// Composition:
//   <ChartWheel>
//     └─ <svg> (responsive, zoom-aware)
//           ├─ <defs>  (gradient, clip paths)
//           ├─ Background
//           ├─ <ZodiacRing>  — 12 sign sectors + ticks
//           ├─ <HouseRing>   — 12 house cusps
//           ├─ <AspectLines> — inner aspect web
//           ├─ <PlanetRing>  — planet glyphs with collision avoidance
//           └─ Center glyph
//
// Features:
//   • ASC fixed at 9 o'clock
//   • Pinch/scroll zoom + pan with mouse drag
//   • Planet hover → dims non-related aspects + highlights planet
//   • Fully responsive via viewBox

import React, { useCallback, useRef, useState, useMemo } from 'react';
import type { ChartResponse } from '@/lib/types/api';
import { buildChartRenderData } from '@/lib/chart/renderer';
import type { RenderedPlanet, RenderedHouse, RenderedAspect } from '@/lib/chart/renderer';
import { CX, CY, VIEWBOX_SIZE, R, PLANET_CIRCLE_R } from '@/lib/chart/constants';
import { fmt } from '@/lib/chart/geometry';
import { ZodiacRing } from './ZodiacRing';
import { HouseRing } from './HouseRing';
import { AspectLines } from './AspectLines';
import { PlanetRing } from './PlanetRing';

interface ChartWheelProps {
  chart: ChartResponse;
  /** Optional: initial zoom scale (1 = no zoom) */
  initialScale?: number;
  /** Show zoom controls */
  showControls?: boolean;
  className?: string;
}

// ─── Zoom / pan state ────────────────────────────────────────────────────────

interface Transform {
  scale: number;
  tx: number;   // translation x (in SVG units)
  ty: number;   // translation y (in SVG units)
}

const MIN_SCALE = 0.65;
const MAX_SCALE = 4.0;
const SCALE_STEP = 0.25;

function clampScale(s: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s));
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChartWheel({
  chart,
  initialScale = 1,
  showControls = true,
  className = '',
}: ChartWheelProps) {
  // ── Build geometry once (memoized on chart identity) ─────────────────────
  const renderData = useMemo(() => buildChartRenderData(chart), [chart]);

  // ── Hover state ──────────────────────────────────────────────────────────
  const [hoveredPlanet, setHoveredPlanet] = useState<RenderedPlanet | null>(null);
  const [hoveredHouse, setHoveredHouse] = useState<RenderedHouse | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<RenderedAspect | null>(null);

  // ── Tooltip state ────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  // ── Transform (zoom + pan) ───────────────────────────────────────────────
  const [transform, setTransform] = useState<Transform>({
    scale: initialScale,
    tx: 0,
    ty: 0,
  });

  // ── Pan drag ─────────────────────────────────────────────────────────────
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStart = useRef<{ mx: number; my: number; tx: number; ty: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragStart.current = { mx: e.clientX, my: e.clientY, tx: transform.tx, ty: transform.ty };
    e.preventDefault();
  }, [transform]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.mx;
    const dy = e.clientY - dragStart.current.my;
    setTransform((prev) => ({
      ...prev,
      tx: dragStart.current!.tx + dx,
      ty: dragStart.current!.ty + dy,
    }));
  }, []);

  const onMouseUp = useCallback(() => {
    dragStart.current = null;
  }, []);

  // ── Wheel zoom ───────────────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.89;
    setTransform((prev) => ({
      ...prev,
      scale: clampScale(prev.scale * factor),
    }));
  }, []);

  // ── Zoom buttons ─────────────────────────────────────────────────────────
  const zoomIn  = () => setTransform((p) => ({ ...p, scale: clampScale(p.scale + SCALE_STEP) }));
  const zoomOut = () => setTransform((p) => ({ ...p, scale: clampScale(p.scale - SCALE_STEP) }));
  const zoomReset = () => setTransform({ scale: initialScale, tx: 0, ty: 0 });

  // ── Hover handlers ───────────────────────────────────────────────────────
  const handlePlanetHover = useCallback((planet: RenderedPlanet | null) => {
    setHoveredPlanet(planet);
    setTooltip(
      planet
        ? {
            text: planet.label,
            x: planet.glyphCenter.x,
            y: planet.glyphCenter.y - PLANET_CIRCLE_R - 8,
          }
        : null
    );
  }, []);

  const handleHouseHover = useCallback((house: RenderedHouse | null) => {
    setHoveredHouse(house);
    setTooltip(
      house
        ? {
            text: `House ${house.house.house_number} (${house.house.sign})`,
            x: house.labelPos.x,
            y: house.labelPos.y - 12,
          }
        : null
    );
  }, []);

  const handleAspectHover = useCallback((aspect: RenderedAspect | null) => {
    setHoveredAspect(aspect);
    setTooltip(
      aspect
        ? {
            text: `${aspect.aspect.planet_1} ${aspect.style.label ?? aspect.aspect.aspect_type} ${aspect.aspect.planet_2}`,
            x: (aspect.p1.x + aspect.p2.x) / 2,
            y: (aspect.p1.y + aspect.p2.y) / 2 - 8,
          }
        : null
    );
  }, []);

  // ── Derived transform string ─────────────────────────────────────────────
  const groupTransform = `translate(${transform.tx}, ${transform.ty}) scale(${transform.scale}) translate(${-CX * (transform.scale - 1) / transform.scale}, ${-CY * (transform.scale - 1) / transform.scale})`;

  // Simplify: zoom from center (CX, CY)
  const zoomTransform = `translate(${CX + transform.tx}, ${CY + transform.ty}) scale(${transform.scale}) translate(${-CX}, ${-CY})`;

  const getAspectId = (ra: RenderedAspect) => 
    `${ra.aspect.planet_1}-${ra.aspect.aspect_type}-${ra.aspect.planet_2}`;

  return (
    <div className={`relative select-none ${className}`}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        className="w-full max-w-[560px] mx-auto aspect-square block"
        style={{ cursor: dragStart.current ? 'grabbing' : 'grab' }}
        role="img"
        aria-label="Natal chart wheel"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
      >
        <defs>
          {/* Radial gradient for center glow */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#0a0a1a" stopOpacity="0" />
          </radialGradient>
          {/* Outer glow gradient for zodiac ring */}
          <radialGradient id="ring-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#0d0d28" stopOpacity="1" />
            <stop offset="85%"  stopColor="#0a0a1e" stopOpacity="1" />
            <stop offset="100%" stopColor="#070714" stopOpacity="1" />
          </radialGradient>
          {/* Clip to outer circle */}
          <clipPath id="chart-clip">
            <circle cx={CX} cy={CY} r={R.ZODIAC_OUTER + 2} />
          </clipPath>
        </defs>

        {/* ── Outermost background ─────────────────────────────────────────── */}
        <circle cx={CX} cy={CY} r={R.ZODIAC_OUTER + 2} fill="url(#ring-bg)" />

        {/* ── Zoomable / pannable group ─────────────────────────────────────── */}
        <g transform={zoomTransform} clipPath="url(#chart-clip)">

          {/* ── 1. Zodiac ring (outermost) ────────────────────────────────── */}
          <ZodiacRing signs={renderData.zodiacSigns} ticks={renderData.degreeTicks} />

          {/* ── 2. House ring ─────────────────────────────────────────────── */}
          <HouseRing 
            houses={renderData.houses} 
            highlightHouse={hoveredHouse?.house.house_number ?? null}
            onHover={handleHouseHover}
          />

          {/* ── 3. Aspect lines (inside house inner) ─────────────────────── */}
          <AspectLines
            aspects={renderData.aspects}
            highlightPlanet={hoveredPlanet?.planet.planet ?? null}
            highlightAspect={hoveredAspect ? getAspectId(hoveredAspect) : null}
            onHover={handleAspectHover}
          />

          {/* ── 4. Center circle (over aspects, under planets) ───────────── */}
          <circle
            cx={CX} cy={CY} r={R.CENTER}
            fill="#060614"
            stroke="rgba(55,48,163,0.55)"
            strokeWidth={0.8}
          />
          {/* Center glow */}
          <circle cx={CX} cy={CY} r={R.CENTER} fill="url(#center-glow)" />
          {/* Center star glyph */}
          <text
            x={CX} y={CY}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="20"
            fill="rgba(99,102,241,0.45)"
            style={{ userSelect: 'none', fontFamily: 'serif' }}
          >
            ✦
          </text>

          {/* ── 5. Planet ring (topmost layer) ───────────────────────────── */}
          <PlanetRing
            planets={renderData.planets}
            highlightPlanet={hoveredPlanet?.planet.planet ?? null}
            onHover={handlePlanetHover}
          />

          {/* ── 6. Inline tooltip (SVG) ──────────────────────────────────── */}
          {tooltip && (
            <g style={{ pointerEvents: 'none' }}>
              <rect
                x={tooltip.x - 44}
                y={tooltip.y - 13}
                width={88}
                height={16}
                rx={4}
                fill="rgba(15,12,40,0.92)"
                stroke="rgba(139,92,246,0.5)"
                strokeWidth={0.6}
              />
              <text
                x={fmt(tooltip.x)}
                y={fmt(tooltip.y - 5)}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="7.5"
                fill="#e2e8f0"
                style={{ userSelect: 'none', fontFamily: 'sans-serif' }}
              >
                {tooltip.text}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* ── Zoom controls ───────────────────────────────────────────────────── */}
      {showControls && (
        <div className="absolute bottom-3 right-3 flex flex-col gap-1">
          <button
            onClick={zoomIn}
            title="Zoom in"
            className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-300 hover:text-violet-300 hover:border-violet-500/50 hover:bg-violet-900/20 transition-all text-sm font-bold flex items-center justify-center backdrop-blur-sm"
          >
            +
          </button>
          <button
            onClick={zoomReset}
            title="Reset zoom"
            className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-400 hover:text-slate-200 hover:border-space-500 transition-all text-xs flex items-center justify-center backdrop-blur-sm"
          >
            ↺
          </button>
          <button
            onClick={zoomOut}
            title="Zoom out"
            className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-300 hover:text-violet-300 hover:border-violet-500/50 hover:bg-violet-900/20 transition-all text-sm font-bold flex items-center justify-center backdrop-blur-sm"
          >
            −
          </button>
        </div>
      )}

      {/* ── Legend: aspect colors ────────────────────────────────────────────── */}
      <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {[
          { color: '#819a96', label: 'Trine' },
          { color: '#8fa3b5', label: 'Sextile' },
          { color: '#bc8f8f', label: 'Square' },
          { color: '#d97b7b', label: 'Opposition' },
          { color: '#a67c7e', label: 'Conjunction' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-slate-400">
            <span
              className="inline-block w-5 h-0.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
