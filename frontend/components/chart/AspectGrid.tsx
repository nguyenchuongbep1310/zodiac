import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AspectResponse, ChartInterpretationResponse } from "@/lib/types/api";
import { PLANET_GLYPHS, ASPECT_COLORS, degreesToDMS } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";
import { cn } from "@/lib/utils";

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
  const [expandedAspects, setExpandedAspects] = useState<Set<string>>(new Set());

  const toggleExpand = (aspectKey: string) => {
    setExpandedAspects(prev => {
      const next = new Set(prev);
      if (next.has(aspectKey)) {
        next.delete(aspectKey);
      } else {
        next.add(aspectKey);
      }
      return next;
    });
  };


  return (
    <div className="overflow-x-auto rounded-xl border border-space-600/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-space-600/50 bg-space-800/80">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.planet")} 1</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.aspect")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.planet")} 2</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t("table.orb")}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.interpretation")}</th>
          </tr>
        </thead>
        <tbody>
          {aspects.map((aspect) => {
            const aspectKey = createAspectKey(aspect);
            const isExpanded = expandedAspects.has(aspectKey);
            const color = ASPECT_COLORS[aspect.aspect_type] ?? "#6b7280";
            const symbol = ASPECT_SYMBOLS[aspect.aspect_type] ?? "~";

            const interp = interpretations?.aspects.find(a => 
              a.aspect_type === aspect.aspect_type &&
              ((a.planet_1 === aspect.planet_1 && a.planet_2 === aspect.planet_2) || 
               (a.planet_1 === aspect.planet_2 && a.planet_2 === aspect.planet_1))
            )?.interpretation;
            
            const hasInterpretation = !!interp;

            return (
              <React.Fragment key={aspectKey}>
                <tr
                  onClick={() => hasInterpretation && toggleExpand(aspectKey)}
                  className={cn(
                    "border-b border-space-700/30 transition-colors",
                    hasInterpretation ? "cursor-pointer hover:bg-space-700/30" : "",
                    isExpanded ? "bg-space-700/20" : ""
                  )}
                >
                  <td className="px-4 py-3 text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-violet-400">
                        {PLANET_GLYPHS[aspect.planet_1] ?? aspect.planet_1[0]}
                      </span>
                      <span className="hidden sm:inline">{t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold border"
                      )}
                      style={{
                        color,
                        borderColor: color + "40",
                        backgroundColor: color + "15",
                      }}
                    >
                      <span className="text-base leading-none">{symbol}</span>
                      <span className="hidden sm:inline capitalize">{t(`aspect.${aspect.aspect_type}`)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-violet-400">
                        {PLANET_GLYPHS[aspect.planet_2] ?? aspect.planet_2[0]}
                      </span>
                      <span className="hidden sm:inline">{t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">
                    {aspect.orb.toFixed(2)}°
                  </td>
                  <td className="px-4 py-3 text-right">
                    {hasInterpretation ? (
                      <button className="text-slate-400 hover:text-violet-400 transition-colors p-1">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </td>
                </tr>

                {isExpanded && hasInterpretation && (
                  <tr className="border-b border-space-700/30 bg-space-800/40">
                    <td colSpan={5} className="px-4 py-4">
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 text-sm text-slate-300 pl-8 border-l-2 border-violet-500/30 ml-4">
                        <div>
                          <h4 className="font-semibold text-violet-300 mb-1 flex items-center gap-2">
                            {PLANET_GLYPHS[aspect.planet_1]} {t(`planet.${aspect.planet_1.toLowerCase().replace(" ", "_")}`)} <span style={{color}}>{symbol}</span> {PLANET_GLYPHS[aspect.planet_2]} {t(`planet.${aspect.planet_2.toLowerCase().replace(" ", "_")}`)}
                          </h4>
                          <div className="space-y-3 mt-3 text-sm">
                            {interp.core_meaning && (
                              <div>
                                <span className="font-semibold text-slate-200">{t("interp.core_meaning")}: </span>
                                <span className="text-slate-300/90">{interp.core_meaning}</span>
                              </div>
                            )}
                             {interp.real_life && (
                                <div>
                                  <span className="font-semibold text-slate-200">{t("interp.real_life")}: </span>
                                  <span className="text-slate-300/90">{interp.real_life}</span>
                                </div>
                              )}
                              {interp.strengths && (
                                <div>
                                  <span className="font-semibold text-emerald-400/90">{t("interp.strengths")}: </span>
                                  <span className="text-slate-300/90">{interp.strengths}</span>
                                </div>
                              )}
                              {interp.challenges && (
                                <div>
                                  <span className="font-semibold text-rose-400/90">{t("interp.challenges")}: </span>
                                  <span className="text-slate-300/90">{interp.challenges}</span>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
