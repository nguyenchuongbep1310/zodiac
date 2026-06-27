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

type Tab = "wheel" | "planets" | "aspects" | "houses";

interface ChartViewerClientProps {
  id: string;
}

export function ChartViewerClient({ id }: ChartViewerClientProps) {
  const { data: chart, isLoading, error } = useChart(id);
  const { data: interpretations, isLoading: interpretationsLoading } = useChartInterpretations(id);
  const [activeTab, setActiveTab] = useState<Tab>("wheel");
  const { t } = useTranslation();

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: "wheel", label: t("charts.tabs.wheel"), emoji: "⭕" },
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
        <Link href="/profiles" className="text-sm text-violet-400 hover:underline mt-2 inline-block">
          {t("profiles.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            href="/profiles"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("profiles.back")}
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">{t("charts.natal_chart")}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="violet">{t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}</Badge>
            <Badge variant="amber">{chart.zodiac_system}</Badge>
            {chart.is_rectified && <Badge variant="emerald">{t("charts.rectified")}</Badge>}
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 p-1 bg-space-800/60 backdrop-blur-sm rounded-2xl border border-space-600/50 w-fit overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap",
              activeTab === tab.id
                ? "bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-glow"
                : "text-slate-400 hover:text-slate-200 hover:bg-space-700"
            )}
          >
            <span>{tab.emoji}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "wheel" && (
        <Card glow>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">{t("charts.tabs.wheel")}</h2>
            <p className="text-xs text-slate-500">
              {t("charts.wheel.desc")
                .replace("{0}", chart.planets.length.toString())
                .replace("{1}", chart.aspects.length.toString())
                .replace("{2}", chart.houses.length.toString())}
            </p>
          </CardHeader>
          <CardContent>
            <ChartWheel chart={chart} />
          </CardContent>
        </Card>
      )}

      {activeTab === "planets" && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">{t("charts.positions")}</h2>
            <p className="text-sm text-slate-400">
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
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">{t("charts.tabs.aspects")}</h2>
            <p className="text-xs text-slate-500">{chart.aspects.length} {t("charts.aspects_found")}</p>
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
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-100">{t("charts.house_cusps")}</h2>
            <p className="text-xs text-slate-500">{t(`system.${chart.house_system}`)} {t("charts.house_system")}</p>
          </CardHeader>
          <CardContent className="p-0">
            <HouseTable houses={chart.houses} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
