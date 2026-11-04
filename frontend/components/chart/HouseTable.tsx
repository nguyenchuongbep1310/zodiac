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
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] bg-[var(--am-field)] shrink-0 shadow-[var(--am-shadow-sm)]">
            <span className={cn(
              "text-lg sm:text-xl font-display font-medium",
              isAngular ? "text-[var(--am-primary)]" : "text-[var(--am-ink)]"
            )}>
              {house.house_number}
            </span>
          </div>
          <div className="flex flex-col min-w-0 gap-0.5">
            <span className={cn(
              "text-base sm:text-lg font-display font-semibold truncate tracking-wide",
              isAngular ? "text-[var(--am-primary)]" : "text-[var(--am-ink)]"
            )}>
              {isAngular ? t(`house.${house.house_number}`) : `${t("table.house")} ${house.house_number}`}
            </span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--am-muted)] truncate">
              <span className="text-[var(--am-ink)] text-sm font-semibold">{ZODIAC_GLYPHS[house.sign]}</span>
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
        <div className="flex justify-end shrink-0 ml-4 text-sm text-[var(--am-muted)] font-semibold">
          {(house.cusp_longitude % 30).toFixed(2)}°
        </div>
      </div>
    );

    const content = (
      <div className="space-y-4 text-[var(--am-muted)]">
        {!hasInterpretation && (
          <p className="text-[var(--am-muted)] italic text-sm">{t("charts.no_interpretations")}</p>
        )}
        
        {houseInterp && (
          <div>
            <h4 className="font-semibold text-[var(--am-ink)] mb-3 flex items-center gap-2">
              {t("table.house")} {house.house_number} {t("misc.in")} {ZODIAC_GLYPHS[house.sign]} {t(`sign.${house.sign.toLowerCase()}`)}
            </h4>
            <div className="space-y-3 text-sm">
              {houseInterp.core_meaning && (
                <div><span className="font-semibold text-[var(--am-ink)]">{t("interp.core_meaning")}: </span><span className="text-[var(--am-muted)]">{houseInterp.core_meaning}</span></div>
              )}
              {houseInterp.real_life && (
                <div><span className="font-semibold text-[var(--am-ink)]">{t("interp.real_life")}: </span><span className="text-[var(--am-muted)]">{houseInterp.real_life}</span></div>
              )}
              {houseInterp.strengths && (
                <div><span className="font-semibold text-[var(--am-ink)]">{t("interp.strengths")}: </span><span className="text-[var(--am-muted)]">{houseInterp.strengths}</span></div>
              )}
              {houseInterp.challenges && (
                <div><span className="font-semibold text-[var(--am-primary)]">{t("interp.challenges")}: </span><span className="text-[var(--am-muted)]">{houseInterp.challenges}</span></div>
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
