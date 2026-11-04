"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const point = (r: number) => [(24 + r * Math.cos(a)).toFixed(2), (24 + r * Math.sin(a)).toFixed(2)] as const;
  return { from: point(15), to: point(i % 2 === 0 ? 23 : 20) };
});

/**
 * Sun-and-eye emblem plus the AstroMind wordmark. Draws in `currentColor`, so a
 * parent can recolour it; set `--brand-accent` to recolour "Astro".
 */
export function BrandLogo({ className, iconOnly = false, size = "md", onClick }: BrandLogoProps) {
  const { localeHref } = useTranslation();

  const iconSizes = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  const textSizes = { sm: "text-xl", md: "text-2xl", lg: "text-3xl" };

  return (
    <Link
      href={localeHref("/")}
      onClick={onClick}
      className={cn("inline-flex items-center gap-2.5 select-none text-[var(--am-ink)]", className)}
    >
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn("shrink-0", iconSizes[size])}>
        {RAYS.map((r, i) => (
          <line key={i} x1={r.from[0]} y1={r.from[1]} x2={r.to[0]} y2={r.to[1]} stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        ))}
        <circle cx="24" cy="24" r="12" fill="var(--am-gold)" stroke="currentColor" strokeWidth="2" />
        <path d="M13.5 24 Q24 15 34.5 24 Q24 33 13.5 24Z" fill="var(--am-surface)" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="24" cy="24" r="4" fill="var(--am-primary)" stroke="currentColor" strokeWidth="1.4" />
      </svg>

      {!iconOnly && (
        <span className={cn("font-display tracking-tight", textSizes[size])}>
          <span className="text-[var(--brand-accent,var(--am-primary))]">Astro</span>
          <span>Mind</span>
        </span>
      )}
    </Link>
  );
}
