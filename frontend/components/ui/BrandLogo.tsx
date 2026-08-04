"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ className, iconOnly = false, size = "md" }: BrandLogoProps) {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  return (
    <Link href="/" className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {/* Enhanced AstroMind Emblem Icon */}
      <div className={cn("relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105", iconSizes[size])}>
        {/* Glowing background ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-purple-500/20 to-indigo-500/20 blur-sm group-hover:blur-md transition-all duration-300" />
        
        {/* Emblem Container */}
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 dark:from-slate-800 dark:via-slate-900 dark:to-black p-1.5 border border-amber-500/30 dark:border-amber-400/40 shadow-md shadow-amber-950/20 flex items-center justify-center overflow-hidden">
          {/* Celestial background dots/stars */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent" />
          
          {/* Custom AstroMind SVG Mark */}
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full relative z-10 text-amber-400">
            {/* Orbital Ring */}
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 2.5" opacity="0.6" />
            
            {/* 8-point Sparkle Star */}
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="url(#astroMindGrad)" stroke="currentColor" strokeWidth="0.5" />
            
            {/* Mind Dot / Inner Core */}
            <circle cx="12" cy="10" r="1.5" fill="#FFF" />
            <circle cx="17.5" cy="5.5" r="1" fill="currentColor" className="animate-pulse" />
            
            <defs>
              <linearGradient id="astroMindGrad" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#FCD34D" />
                <stop offset="1" stopColor="#E0E7FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <span className={cn("font-display font-bold tracking-tight transition-colors flex items-center", textSizes[size])}>
          <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 dark:from-amber-300 dark:via-amber-200 dark:to-amber-400 bg-clip-text text-transparent">
            Astro
          </span>
          <span className="text-slate-900 dark:text-white font-medium ml-0.5">
            Mind
          </span>
        </span>
      )}
    </Link>
  );
}
