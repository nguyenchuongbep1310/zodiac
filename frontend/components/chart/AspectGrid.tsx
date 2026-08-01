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
      a.aspect_type.toLowerCase() === aspect.aspect_type.toLowerCase() &&
      ((a.planet_1.toLowerCase() === aspect.planet_1.toLowerCase() && a.planet_2.toLowerCase() === aspect.planet_2.toLowerCase()) || 
       (a.planet_1.toLowerCase() === aspect.planet_2.toLowerCase() && a.planet_2.toLowerCase() === aspect.planet_1.toLowerCase()))
    )?.interpretation;
    
    const hasInterpretation = !!interp;

    const aspectKeyStr = aspect.aspect_type.toLowerCase().replace(/[-_ ]/g, "");

    const title = (
      <div className="flex items-center justify-between w-full pr-2 sm:pr-4 py-1">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex items-center shrink-0">
            {/* Planet 1 Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 shrink-0 shadow-sm z-10 relative">
              <span className="text-[#5C4033] dark:text-[#E8DDD3] text-2xl sm:text-3xl">{PLANET_GLYPHS[aspect.planet_1] ?? aspect.planet_1[0]}</span>
            </div>
            {/* Planet 2 Icon */}
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#E3D8CB] dark:border-white/10 shrink-0 shadow-sm z-0 relative -ml-6 sm:-ml-7">
              <span className="text-[#5C4033] dark:text-[#E8DDD3] text-2xl sm:text-3xl">{PLANET_GLYPHS[aspect.planet_2] ?? aspect.planet_2[0]}</span>
            </div>
          </div>
          
          <div className="flex flex-col min-w-0 gap-0.5">
            <div className="flex items-center gap-1.5 text-base sm:text-lg font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3] truncate tracking-wide">
              <span className="truncate">{t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)}</span>
              <span className="text-[#947E70] dark:text-[#A8988C] font-light text-xs sm:text-sm shrink-0">&</span>
              <span className="truncate">{t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#7A6E65] dark:text-[#A8988C] font-light truncate">
              <span style={{color}} className="text-sm font-semibold">{symbol}</span>
              <span className="font-medium" style={{color}}>{t(`aspect.${aspectKeyStr}`)}</span>
              <span className="mx-1 opacity-40 shrink-0">•</span>
              <span className="shrink-0 font-medium text-[#8C7A6B] dark:text-[#A8988C]">{aspect.orb.toFixed(2)}° orb</span>
            </div>
          </div>
        </div>
      </div>
    );

    const content = (
      <div className="space-y-4 text-[#5C4033] dark:text-[#A8988C]">
        {!hasInterpretation && (
          <p className="text-[#A8988C] dark:text-[#7A6E65] italic text-sm">No interpretations available.</p>
        )}
        
        {interp && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-[#8C5A3C] dark:text-[#E8B896]">{PLANET_GLYPHS[aspect.planet_1]}</span> {t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)}
              <span style={{color}} className="mx-1 text-lg">{symbol}</span>
              <span className="text-[#8C5A3C] dark:text-[#E8B896]">{PLANET_GLYPHS[aspect.planet_2]}</span> {t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}
            </h4>
            <div className="space-y-3 text-sm">
              {interp.core_meaning && (
                <div><span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">{t("interp.core_meaning")}: </span><span className="text-[#7A6E65] dark:text-[#A8988C]">{interp.core_meaning}</span></div>
              )}
              {interp.real_life && (
                <div><span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">{t("interp.real_life")}: </span><span className="text-[#7A6E65] dark:text-[#A8988C]">{interp.real_life}</span></div>
              )}
              {interp.strengths && (
                <div><span className="font-semibold text-[#2d4a4e] dark:text-[#7C9A86]">{t("interp.strengths")}: </span><span className="text-[#7A6E65] dark:text-[#A8988C]">{interp.strengths}</span></div>
              )}
              {interp.challenges && (
                <div><span className="font-semibold text-[#a67c7e] dark:text-[#C9A0A2]">{t("interp.challenges")}: </span><span className="text-[#7A6E65] dark:text-[#A8988C]">{interp.challenges}</span></div>
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
