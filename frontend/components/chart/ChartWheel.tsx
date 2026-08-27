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
import { useTranslation } from '@/lib/hooks/useI18n';

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

  // ── Pan / pinch (unified via Pointer Events — covers mouse, touch, pen) ───
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStart = useRef<{ mx: number; my: number; tx: number; ty: number } | null>(null);
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null);
  const activePointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const [isDragging, setIsDragging] = useState(false);

  const pinchDistance = (pts: Array<{ x: number; y: number }>) =>
    Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture can legitimately fail (pointer already released, etc.) —
      // gestures still work without it, just less robust to the finger
      // sliding off the element.
    }
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2) {
      dragStart.current = null;
      setIsDragging(false);
      const pts = Array.from(activePointers.current.values());
      pinchStart.current = { dist: pinchDistance(pts), scale: transform.scale };
    } else if (activePointers.current.size === 1) {
      dragStart.current = { mx: e.clientX, my: e.clientY, tx: transform.tx, ty: transform.ty };
      setIsDragging(true);
    }
    e.preventDefault();
  }, [transform]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!activePointers.current.has(e.pointerId)) return;
    activePointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (activePointers.current.size === 2 && pinchStart.current) {
      // Capture the values we need now — `pinchStart.current` is a ref and
      // could be mutated (e.g. by a finger lifting) before React gets
      // around to running this updater, so it must not be read inside it.
      const pts = Array.from(activePointers.current.values());
      const ratio = pinchDistance(pts) / pinchStart.current.dist;
      const nextScale = clampScale(pinchStart.current.scale * ratio);
      setTransform((prev) => ({ ...prev, scale: nextScale }));
    } else if (activePointers.current.size === 1 && dragStart.current) {
      const nextTx = dragStart.current.tx + (e.clientX - dragStart.current.mx);
      const nextTy = dragStart.current.ty + (e.clientY - dragStart.current.my);
      setTransform((prev) => ({ ...prev, tx: nextTx, ty: nextTy }));
    }
  }, []);

  const endPointer = useCallback((e: React.PointerEvent) => {
    activePointers.current.delete(e.pointerId);

    if (activePointers.current.size === 0) {
      dragStart.current = null;
      pinchStart.current = null;
      setIsDragging(false);
    } else if (activePointers.current.size === 1) {
      // One finger lifted mid-pinch — resume panning from the remaining one.
      pinchStart.current = null;
      const [pt] = Array.from(activePointers.current.values());
      dragStart.current = { mx: pt.x, my: pt.y, tx: transform.tx, ty: transform.ty };
      setIsDragging(true);
    }
  }, [transform]);

  // ── Wheel zoom (desktop trackpad/mouse) ───────────────────────────────────
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

  const { t, language } = useTranslation();

  // ── Tap-to-dismiss (touch has no hover, so a tap on empty space clears
  // whatever tooltip a previous tap left showing) ───────────────────────────
  const clearSelection = useCallback(() => {
    setHoveredPlanet(null);
    setHoveredHouse(null);
    setHoveredAspect(null);
    setTooltip(null);
  }, []);

  // ── Hover handlers ───────────────────────────────────────────────────────
  const handlePlanetHover = useCallback((planet: RenderedPlanet | null) => {
    setHoveredPlanet(planet);
    if (!planet) {
      setTooltip(null);
      return;
    }
    const pKey = planet.planet.planet.toLowerCase().replace(" ", "_");
    const sKey = planet.planet.sign.toLowerCase();
    const pName = t(`planet.${pKey}`);
    const sName = t(`sign.${sKey}`);
    const deg = Math.floor(planet.planet.longitude % 30);
    const min = Math.floor(((planet.planet.longitude % 30) - deg) * 60);
    const retroStr = planet.isRetrograde ? ` (℞ ${t("charts.retrograde")})` : "";
    const tooltipText = `${planet.glyph} ${pName} ${deg}°${min.toString().padStart(2, "0")}' ${sName}${retroStr}`;

    setTooltip({
      text: tooltipText,
      x: planet.glyphCenter.x,
      y: planet.glyphCenter.y - PLANET_CIRCLE_R - 8,
    });
  }, [t]);

  const handleHouseHover = useCallback((house: RenderedHouse | null) => {
    setHoveredHouse(house);
    if (!house) {
      setTooltip(null);
      return;
    }
    const sKey = house.house.sign.toLowerCase();
    const sName = t(`sign.${sKey}`);
    const houseTitle = house.isAngular ? t(`house.${house.house.house_number}`) : `${t("table.house")} ${house.house.house_number}`;
    const tooltipText = `${houseTitle} (${sName})`;

    setTooltip({
      text: tooltipText,
      x: house.labelPos.x,
      y: house.labelPos.y - 12,
    });
  }, [t]);

  const handleAspectHover = useCallback((aspect: RenderedAspect | null) => {
    setHoveredAspect(aspect);
    if (!aspect) {
      setTooltip(null);
      return;
    }
    const p1Key = aspect.aspect.planet_1.toLowerCase().replace(" ", "_");
    const p2Key = aspect.aspect.planet_2.toLowerCase().replace(" ", "_");
    const aspKey = aspect.aspect.aspect_type.toLowerCase().replace(/[-_ ]/g, "");
    const p1Name = t(`planet.${p1Key}`);
    const p2Name = t(`planet.${p2Key}`);
    const aspName = t(`aspect.${aspKey}`);
    const tooltipText = `${p1Name} ${aspName} ${p2Name}`;

    setTooltip({
      text: tooltipText,
      x: (aspect.p1.x + aspect.p2.x) / 2,
      y: (aspect.p1.y + aspect.p2.y) / 2 - 8,
    });
  }, [t]);

  // ── Derived transform string ─────────────────────────────────────────────

  // Simplify: zoom from center (CX, CY)
  const zoomTransform = `translate(${CX + transform.tx}, ${CY + transform.ty}) scale(${transform.scale}) translate(${-CX}, ${-CY})`;

  const getAspectId = (ra: RenderedAspect) => 
    `${ra.aspect.planet_1}-${ra.aspect.aspect_type}-${ra.aspect.planet_2}`;

  return (
    <div className={`relative select-none ${className}`}>
      <div className="relative w-full">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
          className="w-full mx-auto aspect-square block touch-none"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          role="img"
          aria-label="Natal chart wheel"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
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

          {/* ── Outermost background (tap here dismisses a tapped tooltip) ───── */}
          <circle cx={CX} cy={CY} r={R.ZODIAC_OUTER + 2} fill="url(#ring-bg)" onClick={clearSelection} />

          {/* ── Zoomable / pannable group ─────────────────────────────────────── */}
          <g transform={zoomTransform} clipPath="url(#chart-clip)">

            {/* ── 1. Zodiac ring (outermost) ────────────────────────────────── */}
            <ZodiacRing signs={renderData.zodiacSigns} ticks={renderData.degreeTicks} />

            {/* ── 2. House ring ─────────────────────────────────────────────── */}
            <HouseRing
              houses={renderData.houses}
              highlightHouse={hoveredHouse?.house.house_number ?? null}
              onHover={handleHouseHover}
              onClick={handleHouseHover}
            />

            {/* ── 3. Aspect lines (inside house inner) ─────────────────────── */}
            <AspectLines
              aspects={renderData.aspects}
              highlightPlanet={hoveredPlanet?.planet.planet ?? null}
              highlightAspect={hoveredAspect ? getAspectId(hoveredAspect) : null}
              onHover={handleAspectHover}
              onClick={handleAspectHover}
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
              onClick={handlePlanetHover}
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
          <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
            <button
              onClick={zoomIn}
              title={language === "vi" ? "Phóng to" : "Zoom in"}
              className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-300 hover:text-violet-300 hover:border-violet-500/50 hover:bg-violet-900/20 transition-all text-sm font-bold flex items-center justify-center backdrop-blur-sm shadow-md"
            >
              +
            </button>
            <button
              onClick={zoomReset}
              title={language === "vi" ? "Đặt lại" : "Reset zoom"}
              className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-400 hover:text-slate-200 hover:border-space-500 transition-all text-xs flex items-center justify-center backdrop-blur-sm shadow-md"
            >
              ↺
            </button>
            <button
              onClick={zoomOut}
              title={language === "vi" ? "Thu nhỏ" : "Zoom out"}
              className="w-7 h-7 rounded-lg bg-space-800/80 border border-space-600/60 text-slate-300 hover:text-violet-300 hover:border-violet-500/50 hover:bg-violet-900/20 transition-all text-sm font-bold flex items-center justify-center backdrop-blur-sm shadow-md"
            >
              −
            </button>
          </div>
        )}
      </div>

      {/* ── Legend: aspect colors ────────────────────────────────────────────── */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2.5 px-2">
        {[
          { color: '#819a96', key: 'trine' },
          { color: '#8fa3b5', key: 'sextile' },
          { color: '#bc8f8f', key: 'square' },
          { color: '#d97b7b', key: 'opposition' },
          { color: '#a67c7e', key: 'conjunction' },
        ].map(({ color, key }) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-[#5C4033] dark:text-slate-300 font-medium">
            <span
              className="inline-block w-5 h-0.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            {t(`aspect.${key}`)}
          </span>
        ))}
      </div>
    </div>
  );
}
