"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Sparkles } from "lucide-react";
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

import { ThemeToggle } from "@/components/theme-toggle";

type Tab = "planets" | "aspects" | "houses";

interface ChartViewerClientProps {
  id: string;
}

export function ChartViewerClient({ id }: ChartViewerClientProps) {
  const { data: chart, isLoading, error } = useChart(id);
  const { data: interpretations, isLoading: interpretationsLoading } = useChartInterpretations(id);
  const [activeTab, setActiveTab] = useState<Tab>("planets");
  const { t, language, setLanguage } = useTranslation();

  const TABS: { id: "planets" | "aspects" | "houses"; label: string; emoji: string }[] = [
    { id: "planets", label: t("charts.tabs.planets"), emoji: "✦" },
    { id: "aspects", label: t("charts.tabs.aspects"), emoji: "△" },
    { id: "houses", label: t("charts.tabs.houses"), emoji: "⌂" },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#B5A499]/20 blur-2xl rounded-full animate-pulse" />
          <Spinner size="lg" />
        </div>
        <p className="text-[#7A6E65] dark:text-[#A8988C] text-sm font-light animate-pulse">
          Loading your cosmic blueprint...
        </p>
      </div>
    );
  }

  if (error || !chart) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-rose-500/20 bg-rose-500/5 p-12 text-center max-w-lg mx-auto mt-20"
      >
        <p className="text-rose-500 dark:text-rose-400 font-display text-xl mb-3">{t("charts.not_found")}</p>
        <Link href="/" className="text-sm text-[#8C5A3C] hover:text-[#4A3525] dark:text-[#E8B896] dark:hover:text-[#E8DDD3] hover:underline mt-2 inline-flex items-center gap-1.5 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          Back to home
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="relative min-h-screen pb-16">
      {/* Subtle page-level decorative backgrounds */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#B5A499]/5 to-transparent blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#a67c7e]/4 to-transparent blur-3xl" />
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
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-[#E8DDD3] transition-colors mb-4 group"
            >
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              {t("profiles.back")}
            </Link>
            <h1 className="font-serif italic font-normal text-4xl sm:text-5xl lg:text-6xl text-[#4A3525] dark:text-[#E8DDD3] tracking-tight mb-3">
              {chart.name === "My Chart" ? "Birth Chart" : (chart.name.toLowerCase().endsWith("chart") ? chart.name : `${chart.name}'s Chart`)}
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 mt-2">
              <Badge variant="outline" className="bg-[#F3EDE4] dark:bg-[#27211C] text-[#5C4033] dark:text-[#E8DDD3] border-[#E3D8CB] dark:border-white/10 font-medium px-4 py-1.5 rounded-full text-xs shadow-sm">
                {t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}
              </Badge>
              <Badge variant="outline" className="bg-[#F3EDE4] dark:bg-[#27211C] text-[#5C4033] dark:text-[#E8DDD3] border-[#E3D8CB] dark:border-white/10 font-medium px-4 py-1.5 rounded-full text-xs shadow-sm">
                {chart.zodiac_system}
              </Badge>
              {chart.is_rectified && (
                <Badge variant="outline" className="bg-teal-500/10 text-teal-800 dark:text-teal-200 border-teal-500/20 font-medium px-4 py-1.5 rounded-full text-xs shadow-sm">
                  {t("charts.rectified")}
                </Badge>
              )}
            </div>
          </div>

          {/* Right Header Controls */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-3 pt-2"
          >
            <div className="flex items-center bg-[#F3EDE4] dark:bg-[#27211C] p-1 rounded-full border border-[#E3D8CB] dark:border-white/10 text-xs font-medium shadow-sm">
              <button
                onClick={() => setLanguage("en")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full transition-all duration-300",
                  language === "en"
                    ? "bg-[#4A3525] text-[#FAF7F2] dark:bg-[#E8DDD3] dark:text-[#1C1815] font-semibold shadow-sm"
                    : "text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-white"
                )}
              >
                English
              </button>
              <button
                onClick={() => setLanguage("vi")}
                className={cn(
                  "px-3.5 py-1.5 rounded-full transition-all duration-300",
                  language === "vi"
                    ? "bg-[#4A3525] text-[#FAF7F2] dark:bg-[#E8DDD3] dark:text-[#1C1815] font-semibold shadow-sm"
                    : "text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-white"
                )}
              >
                Tiếng Việt
              </button>
            </div>
            <ThemeToggle />
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Data Tabs */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">

            {/* Tab nav with animated indicator */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="flex gap-2 p-1.5 bg-[#F3EDE4] dark:bg-[#27211C] rounded-full border border-[#E3D8CB] dark:border-white/10 w-fit overflow-x-auto shadow-md"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap relative",
                    activeTab === tab.id
                      ? "bg-[#4A3525] text-[#FAF7F2] dark:bg-[#E8DDD3] dark:text-[#1C1815] shadow-md font-semibold"
                      : "text-[#7A6E65] dark:text-[#A8988C] hover:text-[#4A3525] dark:hover:text-[#E8DDD3] hover:bg-black/[0.03] dark:hover:bg-white/[0.03]"
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
                  <Card className="bg-[#FAF7F2] dark:bg-[#1C1815] border-[#EBE4D8] dark:border-white/5 shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow duration-500">
                    <CardHeader className="border-[#EBE4D8] dark:border-white/5 bg-[#FAF7F2] dark:bg-[#1C1815] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-serif italic font-normal text-2xl text-[#4A3525] dark:text-[#E8DDD3]">{t("charts.positions")}</h2>
                          <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light mt-0.5">
                            {chart.planets.length} {t("charts.calculated")}
                          </p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 flex items-center justify-center">
                          <span className="text-lg text-[#5C4033] dark:text-[#E8DDD3]">✦</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[#FAF7F2] dark:bg-[#1C1815]">
                      {interpretationsLoading && !interpretations ? (
                        <div className="py-12 flex justify-center"><Spinner /></div>
                      ) : (
                        <PlanetTable planets={chart.planets} interpretations={interpretations} />
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "aspects" && (
                  <Card className="bg-[#FAF7F2] dark:bg-[#1C1815] border-[#EBE4D8] dark:border-white/5 shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow duration-500">
                    <CardHeader className="border-[#EBE4D8] dark:border-white/5 bg-[#FAF7F2] dark:bg-[#1C1815] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-serif italic font-normal text-2xl text-[#4A3525] dark:text-[#E8DDD3]">{t("charts.tabs.aspects")}</h2>
                          <p className="text-xs text-[#7A6E65] dark:text-[#A8988C] font-light mt-0.5">{chart.aspects.length} {t("charts.aspects_found")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 flex items-center justify-center">
                          <span className="text-lg text-[#5C4033] dark:text-[#E8DDD3]">△</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[#FAF7F2] dark:bg-[#1C1815]">
                      {interpretationsLoading && !interpretations ? (
                        <div className="py-12 flex justify-center"><Spinner /></div>
                      ) : chart.aspects.length > 0 ? (
                        <AspectGrid aspects={chart.aspects} interpretations={interpretations} />
                      ) : (
                        <div className="py-8 text-center text-[#7A6E65] dark:text-[#A8988C] text-sm">{t("charts.no_aspects")}</div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {activeTab === "houses" && (
                  <Card className="bg-[#FAF7F2] dark:bg-[#1C1815] border-[#EBE4D8] dark:border-white/5 shadow-lg rounded-[2rem] overflow-hidden hover:shadow-xl transition-shadow duration-500">
                    <CardHeader className="border-[#EBE4D8] dark:border-white/5 bg-[#FAF7F2] dark:bg-[#1C1815] px-6 py-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-serif italic font-normal text-2xl text-[#4A3525] dark:text-[#E8DDD3]">{t("charts.house_cusps")}</h2>
                          <p className="text-xs text-[#7A6E65] dark:text-[#A8988C] font-light mt-0.5">{t(`system.${chart.house_system}`)} {t("charts.houses_suffix")}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 flex items-center justify-center">
                          <span className="text-lg text-[#5C4033] dark:text-[#E8DDD3]">⌂</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 bg-[#FAF7F2] dark:bg-[#1C1815]">
                      <HouseTable houses={chart.houses} interpretations={interpretations} />
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side: Static Chart Wheel */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex justify-center sticky top-24">
            <div className="w-full relative z-10 p-2 sm:p-4 lg:p-8">
              <ChartWheel chart={chart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
