"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useChart, useChartInterpretations } from "@/lib/hooks/useCharts";
import { ChartWheel } from "@/components/chart/ChartWheel";
import { PlanetTable } from "@/components/chart/PlanetTable";
import { AspectGrid } from "@/components/chart/AspectGrid";
import { HouseTable } from "@/components/chart/HouseTable";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/hooks/useI18n";


type Tab = "planets" | "aspects" | "houses";

interface ChartViewerClientProps {
  id: string;
}

export function ChartViewerClient({ id }: ChartViewerClientProps) {
  const { data: chart, isLoading, error } = useChart(id);
  const { data: interpretations, isLoading: interpretationsLoading } = useChartInterpretations(id);
  const [activeTab, setActiveTab] = useState<Tab>("planets");
  const { t, language, localeHref } = useTranslation();

  const TABS: { id: "planets" | "aspects" | "houses"; label: string; emoji: string }[] = [
    { id: "planets", label: t("charts.tabs.planets"), emoji: "✦" },
    { id: "aspects", label: t("charts.tabs.aspects"), emoji: "△" },
    { id: "houses", label: t("charts.tabs.houses"), emoji: "⌂" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[var(--am-primary)]/20 blur-2xl rounded-[var(--am-radius)] animate-pulse" />
          <Spinner size="lg" />
        </div>
        <p className="text-[var(--am-muted)] text-sm font-light animate-pulse">
          {t("charts.loading_blueprint")}
        </p>
      </div>
    );
  }

  if (error || !chart) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[var(--am-radius)] border border-[var(--am-edge)] bg-[var(--am-peach)] p-12 text-center max-w-lg mx-auto mt-20"
      >
        <p className="text-[var(--am-sunset)] dark:text-[var(--am-sunset)] font-display text-xl mb-3">{t("charts.not_found")}</p>
        <Link href={localeHref("/")} className="text-sm text-[var(--am-primary)] hover:text-[var(--am-ink)] hover:underline mt-2 inline-flex items-center gap-1.5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          {t("nav.back_home")}
        </Link>
      </motion.div>
    );
  }

  const chartTitle = (() => {
    if (!chart.name || chart.name === "My Chart" || chart.name === "Birth Chart" || chart.name === "Natal Chart" || chart.name === "Bản Đồ Sao Sinh") {
      return t("charts.title_default");
    }
    if (language === "vi") {
      return `Bản Đồ Sao Của ${chart.name}`;
    }
    return chart.name.toLowerCase().endsWith("chart") ? chart.name : `${chart.name}'s Chart`;
  })();

  const zodiacSystemLabel = t(`system.${chart.zodiac_system.toLowerCase()}`) !== `system.${chart.zodiac_system.toLowerCase()}`
    ? t(`system.${chart.zodiac_system.toLowerCase()}`)
    : chart.zodiac_system;

  return (
    <div className="relative min-h-[100dvh] pb-16">
      {/* Subtle page-level decorative backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
      </div>

      <div className="relative space-y-8 animate-fade-in">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-start justify-between gap-4"
        >
          <div>
            <Link
              href={localeHref("/")}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors mb-4 group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              {t("profiles.back")}
            </Link>
            <h1 className="font-display font-bold tracking-tight text-4xl sm:text-5xl lg:text-6xl text-[var(--am-ink)] tracking-tight mb-3">
              {chartTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <Badge variant="slate" className="bg-[var(--am-field)] text-[var(--am-ink)] border-[var(--am-line)] font-medium px-4 py-1.5 rounded-[var(--am-radius)] text-xs shadow-[var(--am-shadow-sm)]">
                {t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}
              </Badge>
              <Badge variant="slate" className="bg-[var(--am-field)] text-[var(--am-ink)] border-[var(--am-line)] font-medium px-4 py-1.5 rounded-[var(--am-radius)] text-xs shadow-[var(--am-shadow-sm)]">
                {zodiacSystemLabel}
              </Badge>
              {chart.is_rectified && (
                <Badge variant="slate" className="bg-[var(--am-mint)] text-[var(--am-ink)]  border-[var(--am-edge)] font-medium px-4 py-1.5 rounded-[var(--am-radius)] text-xs shadow-[var(--am-shadow-sm)]">
                  {t("charts.rectified")}
                </Badge>
              )}
            </div>
          </div>

        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Data Tabs */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">

            {/* Tab nav with animated indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex gap-2 p-1.5 bg-[var(--am-field)] rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] w-fit overflow-x-auto shadow-[var(--am-shadow-sm)]"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 rounded-[var(--am-radius)] px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap relative",
                    activeTab === tab.id
                      ? "bg-[var(--am-ink)] text-[var(--am-surface)] shadow-[var(--am-shadow-sm)] font-semibold"
                      : "text-[var(--am-muted)] hover:text-[var(--am-ink)] hover:bg-black/[0.03]"
                  )}
                >
                  <span className={cn(
                    "transition-transform duration-300",
                    activeTab === tab.id ? "scale-110" : ""
                  )}>{tab.emoji}</span>
                  {tab.label}
                </button>
              ))}
            </motion.div>

            {/* Tab content with animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {activeTab === "planets" && (
                  <Card className="bg-[var(--am-surface)] border-[var(--am-line)] shadow-[var(--am-shadow)] rounded-[var(--am-radius)] overflow-hidden hover:shadow-[var(--am-shadow)] transition-shadow duration-500">
                    <CardHeader className="border-[var(--am-line)] bg-[var(--am-surface)] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-display font-bold tracking-tight text-2xl text-[var(--am-ink)]">{t("charts.positions")}</h2>
                          <p className="text-sm text-[var(--am-muted)] font-light mt-0.5">
                            {chart.planets.length} {t("charts.calculated")}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-[var(--am-radius)] bg-[var(--am-field)] border-2 border-[var(--am-edge)] flex items-center justify-center">
                          <span className="text-lg text-[var(--am-ink)]">✦</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[var(--am-surface)]">
                      {interpretationsLoading && !interpretations ? (
                        <div className="py-12 flex justify-center"><Spinner /></div>
                      ) : (
                        <PlanetTable planets={chart.planets} interpretations={interpretations} />
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "aspects" && (
                  <Card className="bg-[var(--am-surface)] border-[var(--am-line)] shadow-[var(--am-shadow)] rounded-[var(--am-radius)] overflow-hidden hover:shadow-[var(--am-shadow)] transition-shadow duration-500">
                    <CardHeader className="border-[var(--am-line)] bg-[var(--am-surface)] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-display font-bold tracking-tight text-2xl text-[var(--am-ink)]">{t("charts.tabs.aspects")}</h2>
                          <p className="text-xs text-[var(--am-muted)] font-light mt-0.5">{chart.aspects.length} {t("charts.aspects_found")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-[var(--am-radius)] bg-[var(--am-field)] border-2 border-[var(--am-edge)] flex items-center justify-center">
                          <span className="text-lg text-[var(--am-ink)]">△</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[var(--am-surface)]">
                      {interpretationsLoading && !interpretations ? (
                        <div className="py-12 flex justify-center"><Spinner /></div>
                      ) : chart.aspects.length > 0 ? (
                        <AspectGrid aspects={chart.aspects} interpretations={interpretations} />
                      ) : (
                        <div className="py-8 text-center text-[var(--am-muted)] text-sm">{t("charts.no_aspects")}</div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "houses" && (
                  <Card className="bg-[var(--am-surface)] border-[var(--am-line)] shadow-[var(--am-shadow)] rounded-[var(--am-radius)] overflow-hidden hover:shadow-[var(--am-shadow)] transition-shadow duration-500">
                    <CardHeader className="border-[var(--am-line)] bg-[var(--am-surface)] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-display font-bold tracking-tight text-2xl text-[var(--am-ink)]">{t("charts.house_cusps")}</h2>
                          <p className="text-xs text-[var(--am-muted)] font-light mt-0.5">{t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-[var(--am-radius)] bg-[var(--am-field)] border-2 border-[var(--am-edge)] flex items-center justify-center">
                          <span className="text-lg text-[var(--am-ink)]">⌂</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[var(--am-surface)]">
                      <HouseTable houses={chart.houses} interpretations={interpretations} />
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Static Chart Wheel */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex justify-center lg:sticky lg:top-24">
            <div className="w-full relative z-10 p-2 sm:p-4 lg:p-8">
              <ChartWheel chart={chart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
