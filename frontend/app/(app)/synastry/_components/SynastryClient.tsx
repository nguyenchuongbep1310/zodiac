"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import tzlookup from "tz-lookup";
import { ChevronLeft, ChevronRight, Heart, Home as HomeIcon, Layers, Sparkles } from "lucide-react";

import { useCalculateChart } from "@/lib/hooks/useCharts";
import { useToast } from "@/components/ui/Toast";
import { ChartWheel } from "@/components/chart/ChartWheel";
import { AspectGrid } from "@/components/chart/AspectGrid";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Accordion } from "@/components/ui/Accordion";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { PLANET_GLYPHS, cn } from "@/lib/utils";
import type { ChartResponse } from "@/lib/types/api";
import { computeSynastryAspects, computeHouseOverlays, scoreSynastry } from "@/lib/chart/synastry";
import { PersonForm, type PersonDetails } from "./PersonForm";
import { useTranslation } from "@/lib/hooks/useI18n";

const EMPTY_PERSON: PersonDetails = {
  name: "",
  city: "",
  date: "1990-01-01",
  time: "12:00",
  unknownTime: false,
};

type Step = 1 | 2;
type PairMode = "synastry" | "composite" | "davison" | "portrait";

async function resolveChart(
  person: PersonDetails,
  fallbackName: string,
  calculateChart: ReturnType<typeof useCalculateChart>
): Promise<ChartResponse> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(person.city)}&format=json&limit=1`
  );
  const geoData = await res.json();
  if (!geoData || geoData.length === 0) {
    throw new Error(`Could not find location "${person.city}".`);
  }

  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);
  const resolvedCity = geoData[0].display_name.split(",")[0];

  let tz = "UTC";
  try {
    tz = tzlookup(lat, lon);
  } catch {
    // fall back to UTC
  }

  return calculateChart.mutateAsync({
    name: person.name || fallbackName,
    birth_date: person.date,
    birth_time: person.unknownTime ? "12:00" : person.time,
    timezone: tz,
    latitude: lat,
    longitude: lon,
    city: resolvedCity,
    house_system: "placidus",
  });
}

export function SynastryClient() {
  const { t, language } = useTranslation();
  const [step, setStep] = useState<Step>(1);
  const [personA, setPersonA] = useState<PersonDetails>(EMPTY_PERSON);
  const [personB, setPersonB] = useState<PersonDetails>({ ...EMPTY_PERSON, date: "1992-06-15" });

  const [chartA, setChartA] = useState<ChartResponse | null>(null);
  const [chartB, setChartB] = useState<ChartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeWheel, setActiveWheel] = useState<"A" | "B">("A");
  const [pairMode, setPairMode] = useState<PairMode>("synastry");

  const calcA = useCalculateChart();
  const calcB = useCalculateChart();
  const { error: toastError } = useToast();

  const PAIR_MODES: { id: PairMode; label: string; available: boolean }[] = [
    { id: "synastry", label: language === "vi" ? "Độ Tương Hợp" : "Synastry", available: true },
    { id: "composite", label: language === "vi" ? "Biểu Đồ Hợp Nhất (Composite)" : "Composite", available: false },
    { id: "davison", label: language === "vi" ? "Biểu Đồ Davison" : "Davison", available: false },
    { id: "portrait", label: language === "vi" ? "Chân Dung Cặp Đôi" : "Portrait", available: false },
  ];

  const canAdvance = personA.city && personA.date && (personA.time || personA.unknownTime);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canAdvance) {
      toastError(
        language === "vi" ? "Thiếu thông tin" : "Missing fields",
        language === "vi" ? "Vui lòng điền thông tin ngày giờ sinh của Người 1." : "Please fill out Person 1's birth details."
      );
      return;
    }
    setStep(2);
  };

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personB.city || !personB.date || (!personB.time && !personB.unknownTime)) {
      toastError(
        language === "vi" ? "Thiếu thông tin" : "Missing fields",
        language === "vi" ? "Vui lòng điền thông tin ngày giờ sinh của Người 2." : "Please fill out Person 2's birth details."
      );
      return;
    }

    setIsLoading(true);
    try {
      const [resultA, resultB] = await Promise.all([
        resolveChart(personA, language === "vi" ? "Người 1" : "Person 1", calcA),
        resolveChart(personB, language === "vi" ? "Người 2" : "Person 2", calcB),
      ]);
      setChartA(resultA);
      setChartB(resultB);
      setActiveWheel("A");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred.";
      toastError(language === "vi" ? "Không thể tính bản đồ sao đôi" : "Failed to calculate synastry", message);
    } finally {
      setIsLoading(false);
    }
  };

  const aspects = useMemo(() => {
    if (!chartA || !chartB) return [];
    return computeSynastryAspects(chartA, chartB);
  }, [chartA, chartB]);

  const overlaysAinB = useMemo(() => {
    if (!chartA || !chartB) return [];
    return computeHouseOverlays(chartA, chartB);
  }, [chartA, chartB]);

  const overlaysBinA = useMemo(() => {
    if (!chartA || !chartB) return [];
    return computeHouseOverlays(chartB, chartA);
  }, [chartA, chartB]);

  const connectionScore = useMemo(() => scoreSynastry(aspects), [aspects]);

  const hasResult = !!(chartA && chartB);
  const activeChart = activeWheel === "A" ? chartA : chartB;

  const synastryFaq = useMemo(() => [
    {
      id: "what-is",
      title: <span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
        {language === "vi" ? "Bản đồ sao đôi (Synastry) là gì?" : "What is a synastry chart?"}
      </span>,
      content: language === "vi"
        ? "Bản đồ sao đôi so sánh hai bản đồ sao sinh của hai cá nhân để phân tích các góc chiếu giữa các hành tinh. Nơi Sao Hỏa của một người gặp Sao Kim của người kia hay góc vuông giữa Sao Thổ và Mặt Trăng sẽ tiết lộ điểm tương hợp tự nhiên cũng như các thử thách cần thấu hiểu."
        : "A synastry chart lines up two birth charts and looks at the aspects each person's planets make to the other's. Where one person's Mars meets the other's Venus, where a Saturn squares a Moon — these cross-chart aspects describe how two people meet, where they reinforce each other, and where the friction shows up.",
    },
    {
      id: "accurate",
      title: <span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
        {language === "vi" ? "Độ chính xác của synastry đối với độ tương hợp?" : "How accurate is synastry for compatibility?"}
      </span>,
      content: language === "vi"
        ? "Dữ liệu vị trí hành tinh được tính toán chuẩn xác từ thuật toán thiên văn. Synastry mô tả các động lực tâm lý giữa hai người nhưng không quyết định định mệnh của mối quan hệ. Ý chí và sự thấu hiểu của con người là yếu tố quan trọng nhất."
        : "The positions come from the same calculation engine used for individual natal charts. Synastry describes the astrological pattern between two charts — it doesn't predict whether a relationship will work. People are not their charts.",
    },
    {
      id: "birth-time",
      title: <span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
        {language === "vi" ? "Cả hai người có cần giờ sinh chính xác không?" : "Do both people need an exact birth time?"}
      </span>,
      content: language === "vi"
        ? "Giờ sinh chính xác giúp xác định chính xác các cung địa bàn và góc chiếu với cung Mọc. Nếu không có giờ sinh, các góc chiếu giữa các hành tinh vẫn tính chính xác, hệ thống sẽ mặc định 12:00 trưa."
        : "Exact times unlock the full picture — house overlays and aspects to the angles. Without a time, planet-to-planet aspects still calculate correctly, but house placements aren't reliable, so we default to noon and skip the house layer in that case.",
    },
    {
      id: "how-it-works",
      title: <span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
        {language === "vi" ? "Công cụ tính tương hợp hoạt động như thế nào?" : "How does this synastry tool work?"}
      </span>,
      content: language === "vi"
        ? "Nhập ngày giờ sinh của cả hai người, hệ thống sẽ tính toán bản đồ sao độc lập của từng người và so sánh từng cặp hành tinh để tìm các góc chiếu nằm trong dung sai tiêu chuẩn."
        : "Enter both people's birth details, and the tool calculates each chart, then compares every planet pair for aspects within a standard orb. Expand any pairing in the list above to see the aspect type and orb.",
    },
    {
      id: "free",
      title: <span className="font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
        {language === "vi" ? "Công cụ này có miễn phí không?" : "Is this free to use?"}
      </span>,
      content: language === "vi"
        ? "Có, công cụ tính bản đồ sao đôi hoàn toàn miễn phí và không yêu cầu đăng ký tài khoản."
        : "Yes — generating a synastry chart doesn't require an account. Signing up only helps if you want to save profiles for faster comparisons later.",
    },
  ], [language]);

  return (
    <div className="relative min-h-screen pb-16">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#a67c7e]/8 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#B5A499]/8 to-transparent blur-3xl" />
      </div>

      <div className="relative space-y-10 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#7A6E65] hover:text-[#4A3525] dark:text-[#A8988C] dark:hover:text-[#E8DDD3] transition-colors group"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            {t("nav.back_home")}
          </Link>
          <div className="flex items-center gap-3">
            <BrandLogo size="md" />
            <ThemeToggle />
          </div>
        </div>

        {/* Hero + form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="font-serif italic font-normal text-5xl sm:text-6xl lg:text-7xl text-[#4A3525] dark:text-[#E8DDD3] tracking-tight leading-[1.1]">
            {language === "vi" ? "Tạo Bản Đồ Sao Đôi" : "Create Your Synastry Chart"}
          </h1>
          <p className="text-lg sm:text-xl text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed max-w-2xl mx-auto">
            {language === "vi"
              ? "Khám phá các liên kết, sự hòa hợp và lực hút cảm xúc giữa hai người. So sánh hai bản đồ sao nhanh chóng và chuẩn xác."
              : "The connections, tensions, and unspoken pulls between two charts. Compare two charts through synastry in one click."}
          </p>
        </motion.div>

        {!hasResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="bg-[#FAF7F2] dark:bg-[#1C1815] rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-[#EBE4D8] dark:border-white/5 shadow-xl shadow-[#4A3525]/5 dark:shadow-black/30 max-w-3xl mx-auto"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mb-10">
              {[1, 2].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => n === 1 && setStep(1)}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border transition-all",
                      step === n
                        ? "bg-[#5C4033] border-[#5C4033] text-[#F7F3ED] shadow-md scale-110"
                        : step > n
                        ? "bg-[#EBE4D8] border-[#D0C4B8] text-[#5C4033] dark:bg-white/10 dark:border-white/10 dark:text-[#E8DDD3]"
                        : "border-[#D0C4B8] text-[#8C7A6B] dark:border-white/15 dark:text-[#A8988C]"
                    )}
                  >
                    {n}
                  </button>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:inline",
                      step === n ? "text-[#4A3525] dark:text-[#E8DDD3]" : "text-[#A8988C]"
                    )}
                  >
                    {n === 1
                      ? (language === "vi" ? "Thông Tin Người 1" : "Person 1 Details")
                      : (language === "vi" ? "Thông Tin Người 2" : "Person 2 Details")}
                  </span>
                  {n === 1 && <div className="w-8 sm:w-16 h-px bg-[#D0C4B8] dark:bg-white/10" />}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleNext}
                >
                  <PersonForm label={language === "vi" ? "Người 1" : "Person 1"} value={personA} onChange={setPersonA} accent="violet" />
                  <button
                    type="submit"
                    className="group relative w-full bg-gradient-to-r from-[#5C4033] to-[#8C5A3C] hover:from-[#4A3525] hover:to-[#7A4A30] text-[#F7F3ED] font-semibold text-lg rounded-full py-4 transition-all shadow-lg hover:shadow-xl cursor-pointer mt-8 overflow-hidden inline-flex items-center justify-center gap-2"
                  >
                    <span className="relative z-10">{language === "vi" ? "Tiếp theo: Thông tin Người 2" : "Next: Person 2 Details"}</span>
                    <ChevronRight className="w-5 h-5 relative z-10" />
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleCalculate}
                >
                  <PersonForm label={language === "vi" ? "Người 2" : "Person 2"} value={personB} onChange={setPersonB} accent="amber" />
                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-full border border-[#D0C4B8] dark:border-white/15 text-[#5C4033] dark:text-[#E8DDD3] font-medium hover:bg-[#F3EDE4] dark:hover:bg-white/5 transition-all inline-flex items-center gap-2"
                    >
                      <ChevronLeft className="w-5 h-5" /> {language === "vi" ? "Quay lại" : "Back"}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="group relative flex-1 bg-gradient-to-r from-[#5C4033] to-[#8C5A3C] hover:from-[#4A3525] hover:to-[#7A4A30] text-[#F7F3ED] font-semibold text-lg rounded-full py-4 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 cursor-pointer overflow-hidden inline-flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Spinner size="sm" /> <span>{language === "vi" ? "Đang tính toán…" : "Calculating…"}</span>
                        </>
                      ) : (
                        <>
                          <Heart className="w-5 h-5 relative z-10" />
                          <span className="relative z-10">{language === "vi" ? "Xem Bản Đồ Sao Đôi" : "Create Synastry Chart"}</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ─── Results ────────────────────────────────────────────────────── */}
        {hasResult && chartA && chartB && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-12 max-w-6xl mx-auto"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="font-serif italic text-3xl sm:text-4xl text-[#4A3525] dark:text-[#E8DDD3]">
                  {language === "vi" ? "Bản Đồ Sao Đôi Của Bạn" : "Your Synastry Chart"}
                </h2>
                <p className="text-[#7A6E65] dark:text-[#A8988C] font-light mt-1">
                  {language === "vi" ? "Xếp chồng. So sánh đối chiếu." : "Overlay. Compare."}
                </p>
              </div>
              <Button variant="secondary" onClick={() => { setChartA(null); setChartB(null); setStep(1); }}>
                {language === "vi" ? "So sánh cặp đôi mới" : "Start a new comparison"}
              </Button>
            </div>

            {/* Pair-mode dashboard toggle */}
            <div className="flex flex-wrap items-center gap-2 bg-[#F3EDE4] dark:bg-[#1C1815] p-1.5 rounded-full border border-[#E3D8CB] dark:border-white/10 w-fit">
              {PAIR_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  disabled={!mode.available}
                  onClick={() => mode.available && setPairMode(mode.id)}
                  className={cn(
                    "px-4 sm:px-5 py-2 rounded-full text-sm font-semibold transition-all inline-flex items-center gap-1.5",
                    pairMode === mode.id
                      ? "bg-[#5C4033] text-[#F7F3ED] shadow-sm"
                      : mode.available
                      ? "text-[#7A6E65] dark:text-[#A8988C] hover:text-[#4A3525] dark:hover:text-[#E8DDD3]"
                      : "text-[#C2BCA8] dark:text-white/20 cursor-not-allowed"
                  )}
                >
                  {mode.label}
                  {!mode.available && (
                    <Badge variant="slate" className="text-[10px] px-1.5 py-0">{language === "vi" ? "sắp ra mắt" : "soon"}</Badge>
                  )}
                </button>
              ))}
            </div>

            {/* Connection score strip */}
            <Card glow className="p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-24 h-24 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-[#EBE4D8] dark:text-white/10" />
                  <circle
                    cx="50" cy="50" r="42" fill="none" strokeWidth="8" strokeLinecap="round"
                    stroke="#8C5A3C"
                    strokeDasharray={`${(connectionScore / 100) * 264} 264`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
                  {connectionScore}
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-display text-lg font-semibold text-[#4A3525] dark:text-[#E8DDD3] mb-1">
                  {language === "vi" ? "Độ gắn kết tương hợp" : "Connection strength"}
                </p>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light max-w-xl">
                  {language === "vi"
                    ? `Đánh giá mức độ hài hòa giữa hai bản đồ sao dựa trên tỷ lệ các góc chiếu bổ trợ so với các góc chiếu đối kháng. Đã tìm thấy ${aspects.length} góc chiếu tương tác.`
                    : `A quick, transparent read of how many close, easy-flowing aspects link the two charts versus tense ones — not a compatibility verdict. ${aspects.length} inter-chart aspect${aspects.length === 1 ? "" : "s"} found.`}
                </p>
              </div>
            </Card>

            {/* Chart wheel toggle + wheel */}
            <div>
              <div className="flex items-center gap-2 bg-[#F3EDE4] dark:bg-[#1C1815] p-1.5 rounded-full border border-[#E3D8CB] dark:border-white/10 w-fit mx-auto mb-6">
                {(["A", "B"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => setActiveWheel(side)}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                      activeWheel === side
                        ? "bg-[#5C4033] text-[#F7F3ED] shadow-sm"
                        : "text-[#7A6E65] dark:text-[#A8988C] hover:text-[#4A3525] dark:hover:text-[#E8DDD3]"
                    )}
                  >
                    {side === "A" ? chartA.name || (language === "vi" ? "Người 1" : "Person 1") : chartB.name || (language === "vi" ? "Người 2" : "Person 2")}
                  </button>
                ))}
              </div>
              {activeChart && (
                <div className="max-w-xl mx-auto">
                  <ChartWheel chart={activeChart} />
                </div>
              )}
            </div>

            {/* Feature grid — House Overlays / Inter-Chart Aspects / Pair-Mode */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Card className="p-6">
                <HomeIcon className="w-6 h-6 text-[#8C5A3C] dark:text-[#E8B896] mb-3" />
                <h3 className="font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3] mb-1.5">
                  {language === "vi" ? "Nhà Xếp Chồng" : "House Overlays"}
                </h3>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
                  {language === "vi"
                    ? "Xem vị trí các hành tinh của đối phương rơi vào cung địa bàn nào của bạn - bối cảnh cho các tương tác đời sống."
                    : "See whose planets fall in whose houses — the structural backdrop the aspects play out against."}
                </p>
              </Card>
              <Card className="p-6">
                <Sparkles className="w-6 h-6 text-[#8C5A3C] dark:text-[#E8B896] mb-3" />
                <h3 className="font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3] mb-1.5">
                  {language === "vi" ? "Góc Chiếu Liên Biểu Đồ" : "Inter-Chart Aspects"}
                </h3>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
                  {language === "vi"
                    ? "Mọi góc chiếu giữa hai bản đồ sao kèm dung sai - khám phá sự đồng điệu, lực hút và các điểm cần học hỏi."
                    : "Every cross-chart aspect surfaced with orb — the connections, tensions, and unspoken pulls between two charts."}
                </p>
              </Card>
              <Card className="p-6">
                <Layers className="w-6 h-6 text-[#8C5A3C] dark:text-[#E8B896] mb-3" />
                <h3 className="font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3] mb-1.5">
                  {language === "vi" ? "Bảng Điều Khiển Đôi" : "Pair-Mode Dashboard"}
                </h3>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed">
                  {language === "vi"
                    ? "Chuyển đổi nhanh chóng giữa các kỹ thuật nâng cao như Composite hay Davison khi khả dụng."
                    : "From the same two profiles, jump to composite or Davison techniques as they become available."}
                </p>
              </Card>
            </div>

            {/* House overlays detail */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HouseOverlayTable
                title={language === "vi"
                  ? `Hành tinh của ${chartA.name || "Người 1"} trong nhà của ${chartB.name || "Người 2"}`
                  : `${chartA.name || "Person 1"}'s planets in ${chartB.name || "Person 2"}'s houses`}
                overlays={overlaysAinB}
                t={t}
              />
              <HouseOverlayTable
                title={language === "vi"
                  ? `Hành tinh của ${chartB.name || "Người 2"} trong nhà của ${chartA.name || "Người 1"}`
                  : `${chartB.name || "Person 2"}'s planets in ${chartA.name || "Person 1"}'s houses`}
                overlays={overlaysBinA}
                t={t}
              />
            </div>

            {/* Inter-chart aspects */}
            <Card>
              <CardHeader className="border-[#EBE4D8] dark:border-white/5 bg-[#FAF7F2] dark:bg-[#1C1815] px-6 py-5">
                <h3 className="font-display text-xl font-semibold text-[#4A3525] dark:text-[#E8DDD3]">
                  {language === "vi" ? "Góc Chiếu Liên Biểu Đồ" : "Inter-Chart Aspects"}
                </h3>
                <p className="text-sm text-[#7A6E65] dark:text-[#A8988C] font-light mt-1">
                  {language === "vi"
                    ? `Nhấp vào một góc chiếu để xem chi tiết. Ký hiệu bên trái là của ${chartA.name || "Người 1"}, bên phải là của ${chartB.name || "Người 2"}.`
                    : `Tap a pairing to expand it. Left glyph is always ${chartA.name || "Person 1"}, right is ${chartB.name || "Person 2"}.`}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <AspectGrid aspects={aspects} />
              </CardContent>
            </Card>

            {/* FAQ */}
            <div className="max-w-3xl mx-auto pt-4">
              <h3 className="font-serif italic text-2xl sm:text-3xl text-[#4A3525] dark:text-[#E8DDD3] text-center mb-6">
                {language === "vi" ? "Thông Tin Hữu Ích" : "A Couple of Things"}
              </h3>
              <Card className="p-2 sm:p-4">
                <Accordion items={synastryFaq} />
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ─── House overlay mini-table ────────────────────────────────────────────────

function HouseOverlayTable({
  title,
  overlays,
  t,
}: {
  title: string;
  overlays: { planet: string; house_number: number }[];
  t: (key: string) => string;
}) {
  return (
    <Card>
      <CardHeader className="border-[#EBE4D8] dark:border-white/5 bg-[#FAF7F2] dark:bg-[#1C1815] px-6 py-5">
        <h4 className="font-display font-semibold text-[#4A3525] dark:text-[#E8DDD3]">{title}</h4>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {overlays.map((o) => {
            const pKey = o.planet.toLowerCase().replace(" ", "_");
            const pLabel = t(`planet.${pKey}`) !== `planet.${pKey}` ? t(`planet.${pKey}`) : o.planet;
            return (
              <div
                key={o.planet}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10"
              >
                <span className="text-[#8C5A3C] dark:text-[#E8B896] text-lg">{PLANET_GLYPHS[o.planet] ?? o.planet[0]}</span>
                <span className="text-sm text-[#5C4033] dark:text-[#E8DDD3] truncate">{pLabel}</span>
                <span className="ml-auto text-xs font-semibold text-[#947E70] dark:text-[#A8988C]">{t("table.house")} {o.house_number}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
