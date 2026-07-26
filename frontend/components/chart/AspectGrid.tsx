import React from "react";
import { AspectResponse, ChartInterpretationResponse } from "@/lib/types/api";
import { PLANET_GLYPHS, ASPECT_COLORS } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";
import { cn } from "@/lib/utils";
import { Accordion } from "@/components/ui/Accordion";

interface AspectGridProps {
  aspects: AspectResponse[];
  interpretations?: ChartInterpretationResponse;
}

const ASPECT_SYMBOLS: Record<string, string> = {
  conjunction: "☌",
  opposition: "☍",
  trine: "△",
  square: "□",
  sextile: "⚹",
  quincunx: "⚻",
  semisquare: "∠",
  sesquiquadrate: "⚼",
};

const createAspectKey = (aspect: AspectResponse) => {
  const planets = [aspect.planet_1, aspect.planet_2].sort();
  return `${planets[0]}-${aspect.aspect_type}-${planets[1]}`;
};

export function AspectGrid({ aspects, interpretations }: AspectGridProps) {
  const { t } = useTranslation();

  const items = aspects.map((aspect) => {
    const aspectKey = createAspectKey(aspect);
    const color = ASPECT_COLORS[aspect.aspect_type] ?? "#94A3B8";
    const symbol = ASPECT_SYMBOLS[aspect.aspect_type] ?? "~";

    const interp = interpretations?.aspects.find(a => 
      a.aspect_type === aspect.aspect_type &&
      ((a.planet_1 === aspect.planet_1 && a.planet_2 === aspect.planet_2) || 
       (a.planet_1 === aspect.planet_2 && a.planet_2 === aspect.planet_1))
    )?.interpretation;
    
    const hasInterpretation = !!interp;

    const aspectKeyStr = aspect.aspect_type.toLowerCase().replace(/[-_ ]/g, "");

    const title = (
      <div className="flex items-center justify-between w-full pr-2 sm:pr-4 py-1">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex items-center shrink-0">
            {/* Planet 1 Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white dark:bg-[#0f0f1b] border border-black/5 dark:border-white/5 shrink-0 shadow-sm z-10 relative">
              <span className="text-violet-600 dark:text-violet-400 text-2xl sm:text-3xl">{PLANET_GLYPHS[aspect.planet_1] ?? aspect.planet_1[0]}</span>
            </div>
            {/* Planet 2 Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-50 dark:bg-[#151525] border border-black/5 dark:border-white/5 shrink-0 shadow-sm z-0 relative -ml-6 sm:-ml-7">
              <span className="text-violet-600 dark:text-violet-400 text-2xl sm:text-3xl">{PLANET_GLYPHS[aspect.planet_2] ?? aspect.planet_2[0]}</span>
            </div>
          </div>
          
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-1.5 text-lg sm:text-xl font-display font-medium text-slate-800 dark:text-white truncate tracking-wide">
              <span className="truncate">{t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)}</span>
              <span className="text-slate-400 dark:text-slate-500 font-light text-sm sm:text-base shrink-0">&</span>
              <span className="truncate">{t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400/80 font-light truncate">
              <span style={{color}} className="text-sm font-medium">{symbol}</span>
              <span className="capitalize" style={{color}}>{t(`aspect.${aspectKeyStr}`)}</span>
              <span className="mx-1 opacity-30 shrink-0">•</span>
              <span className="shrink-0">{aspect.orb.toFixed(2)}° orb</span>
            </div>
          </div>
        </div>
      </div>
    );

    const content = (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {!hasInterpretation && (
          <p className="text-slate-400 dark:text-slate-500 italic text-sm">No interpretations available.</p>
        )}
        
        {interp && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-violet-600 dark:text-violet-400">{PLANET_GLYPHS[aspect.planet_1]}</span> {t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)}
              <span style={{color}} className="mx-1 text-lg">{symbol}</span>
              <span className="text-violet-600 dark:text-violet-400">{PLANET_GLYPHS[aspect.planet_2]}</span> {t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}
            </h4>
            <div className="space-y-3 text-sm">
              {interp.core_meaning && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.core_meaning")}: </span><span className="text-slate-600 dark:text-slate-400">{interp.core_meaning}</span></div>
              )}
              {interp.real_life && (
                <div><span className="font-semibold text-slate-800 dark:text-slate-200">{t("interp.real_life")}: </span><span className="text-slate-600 dark:text-slate-400">{interp.real_life}</span></div>
              )}
              {interp.strengths && (
                <div><span className="font-semibold text-teal-600 dark:text-teal-400">{t("interp.strengths")}: </span><span className="text-slate-600 dark:text-slate-400">{interp.strengths}</span></div>
              )}
              {interp.challenges && (
                <div><span className="font-semibold text-rose-600 dark:text-rose-400">{t("interp.challenges")}: </span><span className="text-slate-600 dark:text-slate-400">{interp.challenges}</span></div>
              )}
            </div>
          </div>
        )}
      </div>
    );

    return {
      id: aspectKey,
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
