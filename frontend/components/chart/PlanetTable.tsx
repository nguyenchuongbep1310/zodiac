"use client";

import React from "react";
import { PlanetPositionResponse, ChartInterpretationResponse } from "@/lib/types/api";
import { PLANET_GLYPHS, ZODIAC_GLYPHS, degreesToDMS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";
import { Accordion } from "@/components/ui/Accordion";

interface PlanetTableProps {
  planets: PlanetPositionResponse[];
  interpretations?: ChartInterpretationResponse;
}

export function PlanetTable({ planets, interpretations }: PlanetTableProps) {
  const { t } = useTranslation();

  const items = planets.map((planet) => {
    const signInterp = interpretations?.planet_in_sign.find(p => p.planet === planet.planet)?.interpretation;
    const houseInterp = interpretations?.planet_in_house.find(p => p.planet === planet.planet)?.interpretation;
    const hasInterpretation = !!signInterp || !!houseInterp;

    const title = (
      <div className="flex items-center justify-between w-full pr-2 sm:pr-4 py-1">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 shrink-0 shadow-sm">
            <span className="text-violet-600 dark:text-violet-400 text-2xl sm:text-3xl">{PLANET_GLYPHS[planet.planet] ?? planet.planet[0]}</span>
          </div>
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className="text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white truncate tracking-wide">
              {t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400/80 font-light truncate">
              <span className="text-amber-600 dark:text-amber-400/90 text-sm">{ZODIAC_GLYPHS[planet.sign]}</span>
              <span>{t(`sign.${planet.sign.toLowerCase()}`)}</span>
              <span className="mx-1 opacity-30">•</span>
              <span>{t("table.house")} {planet.house_number}</span>
            </div>
          </div>
        </div>
        <div className="flex justify-end shrink-0 ml-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
          {(planet.longitude % 30).toFixed(2)}°
        </div>
      </div>
    );

    const content = (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {!hasInterpretation && (
          <p className="text-slate-400 dark:text-slate-500 italic text-sm">No interpretations available.</p>
        )}
        
        {signInterp && (
          <div>
            <h4 className="font-semibold text-violet-600 dark:text-violet-300 mb-2 flex items-center gap-2">
              {PLANET_GLYPHS[planet.planet]} {t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)} {t("misc.in")} {ZODIAC_GLYPHS[planet.sign]} {t(`sign.${planet.sign.toLowerCase()}`)}
            </h4>
            <div className="space-y-3 text-sm">
              {signInterp.core_meaning && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.core_meaning")}: </span><span className="text-slate-600 dark:text-slate-400">{signInterp.core_meaning}</span></div>
              )}
              {signInterp.real_life && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.real_life")}: </span><span className="text-slate-600 dark:text-slate-400">{signInterp.real_life}</span></div>
              )}
              {signInterp.strengths && (
                <div><span className="font-semibold text-teal-600 dark:text-teal-400">{t("interp.strengths")}: </span><span className="text-slate-600 dark:text-slate-400">{signInterp.strengths}</span></div>
              )}
              {signInterp.challenges && (
                <div><span className="font-semibold text-rose-600 dark:text-rose-400">{t("interp.challenges")}: </span><span className="text-slate-600 dark:text-slate-400">{signInterp.challenges}</span></div>
              )}
            </div>
          </div>
        )}
        
        {houseInterp && (
          <div className={cn(signInterp ? "pt-4 mt-4 border-t border-black/5 dark:border-white/5" : "")}>
            <h4 className="font-semibold text-amber-600 dark:text-amber-300 mb-2 flex items-center gap-2">
              {PLANET_GLYPHS[planet.planet]} {t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)} {t("misc.in")} {t("table.house")} {planet.house_number}
            </h4>
            <div className="space-y-3 text-sm">
              {houseInterp.core_meaning && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.core_meaning")}: </span><span className="text-slate-600 dark:text-slate-400">{houseInterp.core_meaning}</span></div>
              )}
              {houseInterp.real_life && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.real_life")}: </span><span className="text-slate-600 dark:text-slate-400">{houseInterp.real_life}</span></div>
              )}
              {houseInterp.strengths && (
                <div><span className="font-semibold text-teal-600 dark:text-teal-400">{t("interp.strengths")}: </span><span className="text-slate-600 dark:text-slate-400">{houseInterp.strengths}</span></div>
              )}
              {houseInterp.challenges && (
                <div><span className="font-semibold text-rose-600 dark:text-rose-400">{t("interp.challenges")}: </span><span className="text-slate-600 dark:text-slate-400">{houseInterp.challenges}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    );

    return {
      id: planet.planet,
      title,
      content
    };
  });

  return (
    <div className="w-full">
      {/* Header Row removed for editorial aesthetic */}
      
      {/* Accordion List */}
      <div className="px-4">
        <Accordion items={items} />
      </div>
    </div>
  );
}
