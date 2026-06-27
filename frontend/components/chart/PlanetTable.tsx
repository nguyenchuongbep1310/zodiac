"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { PlanetPositionResponse, ChartInterpretationResponse } from "@/lib/types/api";
import { PLANET_GLYPHS, ZODIAC_GLYPHS, degreesToDMS } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";

interface PlanetTableProps {
  planets: PlanetPositionResponse[];
  interpretations?: ChartInterpretationResponse;
}

export function PlanetTable({ planets, interpretations }: PlanetTableProps) {
  const [expandedPlanets, setExpandedPlanets] = useState<Set<string>>(new Set());
  const { t } = useTranslation();

  const toggleExpand = (planet: string) => {
    setExpandedPlanets(prev => {
      const next = new Set(prev);
      if (next.has(planet)) {
        next.delete(planet);
      } else {
        next.add(planet);
      }
      return next;
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-space-600/50">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-space-600/50 bg-space-800/80">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.planet")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.sign")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide hidden sm:table-cell">{t("table.longitude")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.house")}</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.status")}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wide">{t("table.personality")}</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((planet) => {
            const isExpanded = expandedPlanets.has(planet.planet);
            
            // Find interpretations
            const signInterp = interpretations?.planet_in_sign.find(p => p.planet === planet.planet)?.interpretation;
            const houseInterp = interpretations?.planet_in_house.find(p => p.planet === planet.planet)?.interpretation;
            
            const hasInterpretation = !!signInterp || !!houseInterp;

            return (
              <React.Fragment key={planet.planet}>
                <tr
                  onClick={() => hasInterpretation && toggleExpand(planet.planet)}
                  className={cn(
                    "border-b border-space-700/30 transition-colors",
                    hasInterpretation ? "cursor-pointer hover:bg-space-700/30" : "",
                    isExpanded ? "bg-space-700/20" : ""
                  )}
                >
                  <td className="px-4 py-3 font-medium text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-violet-400 text-base">
                        {PLANET_GLYPHS[planet.planet] ?? planet.planet[0]}
                      </span>
                      <span className="hidden sm:inline">{t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-200">
                    <span className="inline-flex items-center gap-2">
                      <span className="text-amber-400">
                        {ZODIAC_GLYPHS[planet.sign]}
                      </span>
                      <span className="hidden sm:inline">{t(`sign.${planet.sign.toLowerCase()}`)}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">
                    {degreesToDMS(planet.longitude)}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {t("table.house")} {planet.house_number}
                  </td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant={planet.is_retrograde ? "amber" : "emerald"}
                      className="bg-transparent border border-current"
                    >
                      {planet.is_retrograde ? t("status.retrograde") : t("status.direct")}
                    </Badge>
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
                
                {/* Expandable Interpretation Row */}
                {isExpanded && hasInterpretation && (
                  <tr className="border-b border-space-700/30 bg-space-800/40">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 text-sm text-slate-300 pl-8 border-l-2 border-violet-500/30 ml-4">
                        {signInterp && (
                          <div>
                            <h4 className="font-semibold text-violet-300 mb-1 flex items-center gap-2">
                              {PLANET_GLYPHS[planet.planet]} {t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)} {t("misc.in")} {ZODIAC_GLYPHS[planet.sign]} {t(`sign.${planet.sign.toLowerCase()}`)}
                            </h4>
                            <div className="space-y-3 mt-3 text-sm">
                              {signInterp.core_meaning && (
                                <div>
                                  <span className="font-semibold text-slate-200">{t("interp.core_meaning")}: </span>
                                  <span className="text-slate-300/90">{signInterp.core_meaning}</span>
                                </div>
                              )}
                              {signInterp.real_life && (
                                <div>
                                  <span className="font-semibold text-slate-200">{t("interp.real_life")}: </span>
                                  <span className="text-slate-300/90">{signInterp.real_life}</span>
                                </div>
                              )}
                              {signInterp.strengths && (
                                <div>
                                  <span className="font-semibold text-emerald-400/90">{t("interp.strengths")}: </span>
                                  <span className="text-slate-300/90">{signInterp.strengths}</span>
                                </div>
                              )}
                              {signInterp.challenges && (
                                <div>
                                  <span className="font-semibold text-rose-400/90">{t("interp.challenges")}: </span>
                                  <span className="text-slate-300/90">{signInterp.challenges}</span>
                                </div>
                              )}
                              {signInterp.relationships && (
                                <div>
                                  <span className="font-semibold text-pink-400/90">{t("interp.relationships")}: </span>
                                  <span className="text-slate-300/90">{signInterp.relationships}</span>
                                </div>
                              )}
                              {signInterp.growth_path && (
                                <div>
                                  <span className="font-semibold text-sky-400/90">{t("interp.growth_path")}: </span>
                                  <span className="text-slate-300/90">{signInterp.growth_path}</span>
                                </div>
                              )}
                            </div>
                            {signInterp.key_themes && signInterp.key_themes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-4">
                                {signInterp.key_themes.map(kw => (
                                  <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {houseInterp && (
                          <div className={cn(signInterp ? "pt-6 mt-4 border-t border-space-600/30" : "")}>
                            <h4 className="font-semibold text-amber-300 mb-1 flex items-center gap-2">
                              {PLANET_GLYPHS[planet.planet]} {t(`planet.${planet.planet.toLowerCase().replace(" ", "_")}`)} {t("misc.in")} {t("table.house")} {planet.house_number}
                            </h4>
                            <div className="space-y-3 mt-3 text-sm">
                              {houseInterp.core_meaning && (
                                <div>
                                  <span className="font-semibold text-slate-200">{t("interp.core_meaning")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.core_meaning}</span>
                                </div>
                              )}
                              {houseInterp.real_life && (
                                <div>
                                  <span className="font-semibold text-slate-200">{t("interp.real_life")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.real_life}</span>
                                </div>
                              )}
                              {houseInterp.strengths && (
                                <div>
                                  <span className="font-semibold text-emerald-400/90">{t("interp.strengths")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.strengths}</span>
                                </div>
                              )}
                              {houseInterp.challenges && (
                                <div>
                                  <span className="font-semibold text-rose-400/90">{t("interp.challenges")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.challenges}</span>
                                </div>
                              )}
                              {houseInterp.relationships && (
                                <div>
                                  <span className="font-semibold text-pink-400/90">{t("interp.relationships")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.relationships}</span>
                                </div>
                              )}
                              {houseInterp.growth_path && (
                                <div>
                                  <span className="font-semibold text-sky-400/90">{t("interp.growth_path")}: </span>
                                  <span className="text-slate-300/90">{houseInterp.growth_path}</span>
                                </div>
                              )}
                            </div>
                            {houseInterp.key_themes && houseInterp.key_themes.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-4">
                                {houseInterp.key_themes.map(kw => (
                                  <span key={kw} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    {kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
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
