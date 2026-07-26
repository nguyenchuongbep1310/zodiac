"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
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
  const { t } = useTranslation();

  const TABS: { id: "planets" | "aspects" | "houses"; label: string; emoji: string }[] = [
    { id: "planets", label: t("charts.tabs.planets"), emoji: "✦" },
    { id: "aspects", label: t("charts.tabs.aspects"), emoji: "△" },
    { id: "houses", label: t("charts.tabs.houses"), emoji: "⌂" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-rose-400 font-medium">{t("charts.not_found")}</p>
        <Link href="/charts" className="text-sm text-violet-400 hover:underline mt-2 inline-block">
          Back
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-5xl lg:text-6xl font-display font-normal text-slate-800 dark:text-white drop-shadow-sm tracking-tight mb-2">{chart.name}'s Chart</h1>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="violet" className="bg-violet-500/20 text-violet-200 border-violet-500/30">{t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}</Badge>
            <Badge variant="amber" className="bg-amber-500/20 text-amber-200 border-amber-500/30">{chart.zodiac_system}</Badge>
            {chart.is_rectified && <Badge variant="emerald" className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30">{t("charts.rectified")}</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex flex-col lg:grid">
        
        {/* Left Side: Data Tabs */}
        <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">

          {/* Tab nav */}
          <div className="flex gap-1 p-1.5 bg-white/5 dark:bg-white/[0.03] backdrop-blur-lg rounded-full border border-black/10 dark:border-white/10 w-fit overflow-x-auto shadow-sm">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                  activeTab === tab.id
                    ? "bg-violet-600/20 dark:bg-violet-600/40 text-violet-700 dark:text-violet-100 border border-violet-400/30 dark:border-violet-400/50 shadow-glass rounded-full"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 border border-transparent rounded-full font-light"
                )}
              >
                <span>{tab.emoji}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="animate-slide-up">
            {activeTab === "planets" && (
              <Card className="bg-white/5 dark:bg-white/[0.03] border-black/10 dark:border-white/10 backdrop-blur-lg shadow-glass rounded-2xl">
                <CardHeader className="border-black/5 dark:border-white/5">
                  <h2 className="text-xl font-display font-semibold text-slate-800 dark:text-white">{t("charts.positions")}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400/70 font-light mt-1">
                    {chart.planets.length} {t("charts.calculated")}
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  {interpretationsLoading && !interpretations ? (
                    <div className="py-12 flex justify-center"><Spinner /></div>
                  ) : (
                    <PlanetTable planets={chart.planets} interpretations={interpretations} />
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "aspects" && (
              <Card className="bg-white/5 dark:bg-white/[0.03] border-black/10 dark:border-white/10 backdrop-blur-lg shadow-glass rounded-2xl">
                <CardHeader className="border-black/5 dark:border-white/5">
                  <h2 className="text-xl font-display font-semibold text-slate-800 dark:text-white">{t("charts.tabs.aspects")}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400/70 font-light mt-1">{chart.aspects.length} {t("charts.aspects_found")}</p>
                </CardHeader>
                <CardContent className="p-0">
                  {interpretationsLoading && !interpretations ? (
                    <div className="py-12 flex justify-center"><Spinner /></div>
                  ) : chart.aspects.length > 0 ? (
                    <AspectGrid aspects={chart.aspects} interpretations={interpretations} />
                  ) : (
                    <div className="py-8 text-center text-slate-500 text-sm">{t("charts.no_aspects")}</div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "houses" && (
              <Card className="bg-white/5 dark:bg-white/[0.03] border-black/10 dark:border-white/10 backdrop-blur-lg shadow-glass rounded-2xl">
                <CardHeader className="border-black/5 dark:border-white/5">
                  <h2 className="text-xl font-display font-semibold text-slate-800 dark:text-white">{t("charts.house_cusps")}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400/70 font-light mt-1">{t(`system.${chart.house_system}`)} {t("charts.house_system")}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <HouseTable houses={chart.houses} interpretations={interpretations} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Right Side: Chart Wheel */}
        <div className="lg:col-span-7 relative order-1 lg:order-2 flex items-center justify-center min-h-[500px]">
          {/* Subtle cosmic pulsing aura behind the chart */}
          <div className="absolute inset-0 bg-violet-600/5 dark:bg-violet-600/10 blur-[100px] rounded-full animate-pulse-glow pointer-events-none" />
          
          <div className="w-full h-full relative z-10 p-4 lg:p-8 hover:scale-[1.02] transition-transform duration-700 ease-out">
            <ChartWheel chart={chart} />
          </div>
        </div>
      </div>
    </div>
  );
}
