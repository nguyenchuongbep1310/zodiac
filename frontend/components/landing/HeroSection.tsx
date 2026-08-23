"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalculateChart } from "@/lib/hooks/useCharts";
import { useToast } from "@/components/ui/Toast";
import { useTranslation } from "@/lib/hooks/useI18n";
import { motion } from "framer-motion";
import { resolveLocation, searchCities } from "@/lib/utils/geocode";

export function HeroSection() {
  const router = useRouter();
  const calculateChart = useCalculateChart();
  const { error: toastError } = useToast();
  const { t, language } = useTranslation();

  const [name, setName] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [date, setDate] = useState("1995-10-24");
  const [time, setTime] = useState("08:30");
  const [unknownTime, setUnknownTime] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const [houseSystem, setHouseSystem] = useState<"placidus" | "koch" | "whole_sign" | "equal">("placidus");
  const [isLoading, setIsLoading] = useState(false);
  const [geoResults, setGeoResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (city.length >= 2 && showDropdown) {
      const timeout = setTimeout(async () => {
        const data = await searchCities(city);
        setGeoResults(data);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setGeoResults([]);
    }
  }, [city, showDropdown]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city || !date || (!time && !unknownTime)) {
      toastError(t("home.hero.toast_missing_title"), t("home.hero.toast_missing_desc"));
      return;
    }

    const birthTime = unknownTime ? "12:00" : time;
    setIsLoading(true);

    try {
      const location = await resolveLocation(city);
      
      if (!location) {
        toastError(t("home.hero.toast_not_found_title"), t("home.hero.toast_not_found_desc"));
        setIsLoading(false);
        return;
      }

      const defaultChartName = language === "vi" ? "Bản Đồ Sao Sinh" : "Birth Chart";

      const chart = await calculateChart.mutateAsync({
        name: name || defaultChartName,
        birth_date: date,
        birth_time: birthTime,
        timezone: location.timezone,
        latitude: location.lat,
        longitude: location.lon,
        city: location.city,
        house_system: houseSystem,
      });

      router.push(`/charts/${chart.id}`);
    } catch (err: any) {
      toastError(t("home.hero.toast_calc_error"), err.message || t("misc.error"));
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full bg-[#F7F3ED] dark:bg-[#14110F] pt-28 sm:pt-32 pb-24 px-4 sm:px-8 lg:px-12 transition-colors overflow-hidden">
      {/* Subtle decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#B5A499]/8 to-transparent blur-3xl" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#a67c7e]/6 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto space-y-10">
        
        {/* Header with fade-in animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center space-y-4 max-w-3xl mx-auto"
        >
          <h1 className="font-serif italic font-normal text-5xl sm:text-6xl lg:text-7xl text-[#4A3525] dark:text-[#E8DDD3] tracking-tight leading-[1.1]">
            {t("home.hero.title")}
          </h1>
          <p className="text-lg sm:text-xl text-[#7A6E65] dark:text-[#A8988C] font-light leading-relaxed max-w-2xl mx-auto">
            {t("home.hero.desc")}
          </p>
        </motion.div>

        {/* Outer Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="bg-[#FAF7F2] dark:bg-[#1C1815] rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-[#EBE4D8] dark:border-white/5 shadow-xl shadow-[#4A3525]/5 dark:shadow-black/30"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-5 space-y-6">
              <form onSubmit={handleStart} className="space-y-5">
                
                {/* Birth Date */}
                <div>
                  <label className="text-base font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-2 block">
                    {t("home.hero.date_label")}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#947E70]" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] text-base focus:outline-none focus:ring-2 focus:ring-[#B5A499] transition-all hover:border-[#B5A499]/60 dark:hover:border-white/20"
                    />
                  </div>
                </div>

                {/* Birth Time */}
                <div>
                  <label className="text-base font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-2 block">
                    {t("home.hero.time_label")}
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#947E70]" />
                    <input
                      type="time"
                      value={time}
                      disabled={unknownTime}
                      onChange={(e) => setTime(e.target.value)}
                      required={!unknownTime}
                      className="w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] text-base focus:outline-none focus:ring-2 focus:ring-[#B5A499] transition-all disabled:opacity-50 hover:border-[#B5A499]/60 dark:hover:border-white/20"
                    />
                  </div>
                  <label className="flex items-center gap-2 mt-2.5 cursor-pointer text-sm text-[#7A6E65] dark:text-[#A8988C]">
                    <input
                      type="checkbox"
                      checked={unknownTime}
                      onChange={(e) => setUnknownTime(e.target.checked)}
                      className="rounded border-[#D0C4B8] text-[#9E8B7F] focus:ring-0 w-4 h-4"
                    />
                    <span>{t("home.hero.unknown_time")}</span>
                  </label>
                </div>

                {/* Birth Location */}
                <div className="relative">
                  <label className="text-base font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-2 block">
                    {t("home.hero.location_label")}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#947E70] pointer-events-none" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setShowDropdown(true);
                      }}
                      onFocus={() => setShowDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                      placeholder={t("home.hero.location_placeholder")}
                      required
                      autoComplete="off"
                      className="w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] placeholder-[#A8988C] text-base focus:outline-none focus:ring-2 focus:ring-[#B5A499] transition-all hover:border-[#B5A499]/60 dark:hover:border-white/20"
                    />
                  </div>

                  {/* Location Autocomplete Dropdown */}
                  {showDropdown && geoResults.length > 0 && (
                    <ul className="absolute z-50 w-full mt-1 bg-[#FAF7F2] dark:bg-[#1E1915] border border-[#E5DCD0] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden text-left max-h-56 overflow-y-auto">
                      {geoResults.map((result, i) => (
                        <li
                          key={i}
                          className="px-5 py-3 hover:bg-[#F0E6D8] dark:hover:bg-white/5 cursor-pointer text-sm text-[#5C4033] dark:text-[#E8DDD3] border-b border-[#EBE4D8] dark:border-white/5 last:border-0"
                          onClick={() => {
                            setCity(result.display_name.split(",")[0]);
                            setShowDropdown(false);
                          }}
                        >
                          {result.display_name}
                        </li>
                      ))}
                    </ul>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const sampleCities = language === "vi"
                        ? ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Đà Lạt"]
                        : ["New York", "London", "Paris", "Tokyo", "Sydney", "Hanoi"];
                      setCity(sampleCities[Math.floor(Math.random() * sampleCities.length)]);
                    }}
                    className="text-xs sm:text-sm text-[#8C7A6B] dark:text-[#A8988C] hover:underline mt-2 inline-block font-light"
                  >
                    {t("home.hero.manual_coords")}
                  </button>
                </div>

                {/* Show Extended Settings */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowExtended(!showExtended)}
                    className="text-xs sm:text-sm text-[#8C7A6B] dark:text-[#A8988C] font-medium hover:underline inline-block"
                  >
                    {showExtended ? t("home.hero.hide_extended") : t("home.hero.show_extended")}
                  </button>

                  {showExtended && (
                    <div className="mt-3 p-5 bg-[#F3EDE4] dark:bg-[#27211C] rounded-2xl space-y-3 border border-[#E3D8CB] dark:border-white/10">
                      <div>
                        <label className="text-xs sm:text-sm font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-1 block">
                          {t("home.hero.house_system")}
                        </label>
                        <select
                          value={houseSystem}
                          onChange={(e) => setHouseSystem(e.target.value as any)}
                          className="w-full bg-[#FAF7F2] dark:bg-[#1C1815] border border-[#E3D8CB] dark:border-white/10 rounded-xl p-2.5 text-sm text-[#4A3525] dark:text-[#E8DDD3]"
                        >
                          <option value="placidus">{t("system.placidus")}</option>
                          <option value="whole_sign">{t("system.whole_sign")}</option>
                          <option value="koch">{t("system.koch")}</option>
                          <option value="equal">{t("system.equal")}</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full bg-gradient-to-r from-[#5C4033] to-[#8C5A3C] hover:from-[#4A3525] hover:to-[#7A4A30] text-[#F7F3ED] font-semibold text-lg rounded-full py-4 transition-all shadow-lg hover:shadow-xl disabled:opacity-60 cursor-pointer mt-6 overflow-hidden"
                >
                  <span className="relative z-10">{isLoading ? t("home.hero.btn_loading") : t("home.hero.btn_submit")}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8C5A3C] to-[#A67C7E] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </button>
              </form>
            </div>

            {/* Right Column: Large Prominent Chart Wheel Visual */}
            <div className="lg:col-span-7 flex items-center justify-center p-2 sm:p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
                className="relative w-full max-w-[540px] sm:max-w-[620px] lg:max-w-[680px] aspect-square flex items-center justify-center"
              >
                {/* Subtle glow behind wheel */}
                <div className="absolute inset-[10%] rounded-full bg-gradient-radial from-[#B5A499]/10 to-transparent blur-2xl" />

                {/* SVG Natal Chart Graphic */}
                <svg viewBox="0 0 500 500" className="w-full h-full text-[#9C897B] dark:text-[#B5A499] drop-shadow-sm">
                  {/* Outer ring */}
                  <circle cx="250" cy="250" r="230" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="250" cy="250" r="215" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="250" cy="250" r="140" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="250" cy="250" r="80" fill="none" stroke="currentColor" strokeWidth="1" />

                  {/* 12 House Cusp Lines */}
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
                    const rad = (angle * Math.PI) / 180;
                    const x1 = (250 + 80 * Math.cos(rad)).toFixed(2);
                    const y1 = (250 + 80 * Math.sin(rad)).toFixed(2);
                    const x2 = (250 + 230 * Math.cos(rad)).toFixed(2);
                    const y2 = (250 + 230 * Math.sin(rad)).toFixed(2);
                    return (
                      <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="currentColor"
                        strokeWidth={i % 3 === 0 ? "1.5" : "0.75"}
                        opacity={i % 3 === 0 ? "0.8" : "0.5"}
                      />
                    );
                  })}

                  {/* Colored Aspect Lines in Center */}
                  <line x1="190" y1="190" x2="310" y2="310" stroke="#7C9A86" strokeWidth="1.2" opacity="0.8" />
                  <line x1="190" y1="310" x2="310" y2="190" stroke="#8C6E8A" strokeWidth="1.2" opacity="0.8" />
                  <line x1="200" y1="210" x2="300" y2="290" stroke="#B87D70" strokeWidth="1.2" opacity="0.8" />
                  <line x1="180" y1="250" x2="320" y2="250" stroke="#7C9A86" strokeWidth="1.2" opacity="0.8" />
                  <line x1="220" y1="170" x2="280" y2="330" stroke="#C2A066" strokeWidth="1.2" opacity="0.8" />

                  {/* Planet & Zodiac Glyphs placeholders matching reference */}
                  <text x="245" y="42" fill="#B87D70" fontSize="16" fontFamily="serif">♑</text>
                  <text x="350" y="70" fill="#C2A066" fontSize="16" fontFamily="serif">♒</text>
                  <text x="425" y="150" fill="#7C9A86" fontSize="16" fontFamily="serif">♓</text>
                  <text x="440" y="255" fill="#B87D70" fontSize="16" fontFamily="serif">♈</text>
                  <text x="420" y="360" fill="#C2A066" fontSize="16" fontFamily="serif">♉</text>
                  <text x="340" y="440" fill="#8C6E8A" fontSize="16" fontFamily="serif">♊</text>
                  <text x="245" y="465" fill="#7C9A86" fontSize="16" fontFamily="serif">♋</text>
                  <text x="140" y="440" fill="#B87D70" fontSize="16" fontFamily="serif">♌</text>
                  <text x="60" y="360" fill="#C2A066" fontSize="16" fontFamily="serif">♍</text>
                  <text x="40" y="255" fill="#8C6E8A" fontSize="16" fontFamily="serif">♎</text>
                  <text x="65" y="150" fill="#7C9A86" fontSize="16" fontFamily="serif">♏</text>
                  <text x="140" y="70" fill="#B87D70" fontSize="16" fontFamily="serif">♐</text>

                  {/* Inner Planet Symbols */}
                  <text x="200" y="130" fill="#4A3525" fontSize="14">☉</text>
                  <text x="280" y="150" fill="#4A3525" fontSize="14">☽</text>
                  <text x="330" y="210" fill="#4A3525" fontSize="14">☿</text>
                  <text x="310" y="300" fill="#4A3525" fontSize="14">♀</text>
                  <text x="270" y="360" fill="#4A3525" fontSize="14">♂</text>
                  <text x="170" y="340" fill="#4A3525" fontSize="14">♃</text>
                  <text x="140" y="280" fill="#4A3525" fontSize="14">♄</text>
                  <text x="150" y="200" fill="#4A3525" fontSize="14">♅</text>
                </svg>
              </motion.div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}
