"use client";

import React from "react";
import { HouseCuspResponse, ChartInterpretationResponse } from "@/lib/types/api";
import { ZODIAC_GLYPHS, cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";
import { Accordion } from "@/components/ui/Accordion";

interface HouseTableProps {
  houses: HouseCuspResponse[];
  interpretations?: ChartInterpretationResponse;
}

const ANGULAR_HOUSES = [1, 4, 7, 10];

export function HouseTable({ houses, interpretations }: HouseTableProps) {
  const { t } = useTranslation();

  const items = houses.map((house) => {
    const isAngular = ANGULAR_HOUSES.includes(house.house_number);
    const houseInterp = interpretations?.house_in_sign?.find(h => h.house_number === house.house_number)?.interpretation;
    const hasInterpretation = !!houseInterp;

    const title = (
      <div className="flex items-center justify-between w-full pr-2 sm:pr-4 py-1">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black/5 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 shrink-0 shadow-sm">
            <span className={cn(
              "text-lg sm:text-xl font-display font-medium",
              isAngular ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-slate-300"
            )}>
              {house.house_number}
            </span>
          </div>
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className={cn(
              "text-base sm:text-lg font-display font-semibold truncate tracking-wide",
              isAngular ? "text-amber-700 dark:text-amber-400" : "text-[#4A3525] dark:text-[#E8DDD3]"
            )}>
              {isAngular ? t(`house.${house.house_number}`) : `${t("table.house")} ${house.house_number}`}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-light truncate">
              <span className="text-amber-600 dark:text-amber-400 text-sm font-semibold">{ZODIAC_GLYPHS[house.sign]}</span>
              <span className="font-medium">{t(`sign.${house.sign.toLowerCase()}`)}</span>
              {isAngular && (
                <>
                  <span className="mx-1 opacity-40">•</span>
                  <span className="opacity-80">{t("table.house")} {house.house_number}</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end shrink-0 ml-4 text-sm text-[#8C7A6B] dark:text-[#A8988C] font-semibold">
          {(house.cusp_longitude % 30).toFixed(2)}°
        </div>
      </div>
    );

    const content = (
      <div className="space-y-4 text-slate-700 dark:text-slate-300">
        {!hasInterpretation && (
          <p className="text-slate-400 dark:text-slate-500 italic text-sm">{t("charts.no_interpretations")}</p>
        )}
        
        {houseInterp && (
          <div>
            <h4 className="font-semibold text-amber-600 dark:text-amber-300 mb-3 flex items-center gap-2">
              {t("table.house")} {house.house_number} {t("misc.in")} {ZODIAC_GLYPHS[house.sign]} {t(`sign.${house.sign.toLowerCase()}`)}
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
      id: house.house_number.toString(),
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
