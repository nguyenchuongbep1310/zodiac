"use client";

import { useState, useEffect } from "react";
import { Calendar, Check, Clock, Search, Sparkles, User } from "lucide-react";
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
  const { t, language, localeHref } = useTranslation();

  const [name, setName] = useState("");
  const [city, setCity] = useState("Hà Nội");
  const [date, setDate] = useState("1995-10-24");
  const [time, setTime] = useState("08:30");
  const [unknownTime, setUnknownTime] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const [houseSystem, setHouseSystem] = useState<"placidus" | "koch" | "whole_sign" | "equal">("placidus");
  const [isLoading, setIsLoading] = useState(false);
  const [geoResults, setGeoResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (city.length >= 2 && showDropdown) {
      const timeout = setTimeout(async () => {
        const data = await searchCities(city);
        setGeoResults(data);
      }, 300);
      return () => clearTimeout(timeout);
    }
    // Clearing suggestions when the dropdown closes or the query is too short
    // is a reset of this component's own UI state, not an external data sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGeoResults([]);
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

      router.push(localeHref(`/charts/${chart.id}`));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t("misc.error");
      toastError(t("home.hero.toast_calc_error"), message);
      setIsLoading(false);
    }
  };

  // Copy marks the highlighted half of the headline with "|".
  const [titleLead, titleHighlight] = t("home.hero.title").split("|").map((part) => part.trim());

  const label = "block text-sm font-semibold text-[var(--am-ink)] mb-1.5";
  const field =
    "w-full h-12 rounded-2xl border border-[var(--am-line)] bg-[var(--am-field)] px-4 text-base text-[var(--am-ink)] placeholder:text-[var(--am-muted)]/70 focus:outline-none focus:border-[var(--am-primary)] focus:ring-4 focus:ring-[var(--am-primary)]/15 disabled:opacity-50 transition";
  const icon = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--am-muted)]";
  const linkBtn = "text-sm text-[var(--am-primary)] font-medium hover:underline underline-offset-4";

  return (
    <section id="hero" className="relative w-full overflow-hidden pt-28 sm:pt-32 pb-16 md:pb-24">
      {/* Soft gradient blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 w-[28rem] h-[28rem] rounded-full bg-[var(--am-lilac)] blur-3xl opacity-80" />
        <div className="absolute top-40 -right-32 w-[26rem] h-[26rem] rounded-full bg-[var(--am-peach)] blur-3xl opacity-80" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--am-surface)] border border-[var(--am-line)] px-4 py-1.5 text-sm font-medium text-[var(--am-ink)] shadow-sm">
            <Sparkles className="w-4 h-4 text-[var(--am-sunset)]" aria-hidden="true" />
            {t("home.hero.eyebrow")}
          </span>
          <h1 className="font-display font-extrabold tracking-tight text-[2.6rem] leading-[1.15] sm:text-6xl lg:text-7xl text-[var(--am-ink)] mt-6">
            {titleLead}
            {titleHighlight && (
              <>
                {" "}
                <span className="am-gradient-text">{titleHighlight}</span>
              </>
            )}
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-[var(--am-muted)] max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {t("home.hero.desc")}
          </p>
          <p className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--am-muted)]">
            <span className="grid place-items-center w-5 h-5 rounded-full bg-[var(--am-mint)] text-[var(--am-ink)]">
              <Check className="w-3 h-3" aria-hidden="true" />
            </span>
            {t("home.hero.trust")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <div className="rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] p-5 sm:p-8 shadow-[0_24px_60px_-20px_rgba(76,52,200,0.35)]">
            <h2 className="font-display text-2xl font-bold text-[var(--am-ink)] mb-5">{t("home.hero.form_title")}</h2>
            <form onSubmit={handleStart} className="space-y-4">
              <div>
                <label htmlFor="hero-name" className={label}>{t("home.hero.name_label")}</label>
                <div className="relative">
                  <User className={icon} aria-hidden="true" />
                  <input
                    id="hero-name"
                    type="text"
                    value={name}
                    maxLength={100}
                    autoComplete="given-name"
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("home.hero.name_placeholder")}
                    className={`${field} pl-10`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="hero-date" className={label}>{t("home.hero.date_label")}</label>
                  <div className="relative">
                    <Calendar className={`${icon} hidden sm:block`} aria-hidden="true" />
                    <input
                      id="hero-date"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className={`${field} sm:pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="hero-time" className={label}>{t("home.hero.time_label")}</label>
                  <div className="relative">
                    <Clock className={`${icon} hidden sm:block`} aria-hidden="true" />
                    <input
                      id="hero-time"
                      type="time"
                      value={time}
                      disabled={unknownTime}
                      onChange={(e) => setTime(e.target.value)}
                      required={!unknownTime}
                      className={`${field} sm:pl-10`}
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--am-ink)]">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                  className="w-4 h-4 rounded accent-[var(--am-primary)]"
                />
                <span>{t("home.hero.unknown_time")}</span>
              </label>

              <div className="relative">
                <label htmlFor="hero-city" className={label}>{t("home.hero.location_label")}</label>
                <div className="relative">
                  <Search className={icon} aria-hidden="true" />
                  <input
                    id="hero-city"
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
                    className={`${field} pl-10`}
                  />
                </div>

                {showDropdown && geoResults.length > 0 && (
                  <ul className="absolute z-50 w-full mt-2 bg-[var(--am-surface)] border border-[var(--am-line)] rounded-2xl shadow-xl overflow-hidden text-left max-h-56 overflow-y-auto">
                    {geoResults.map((result, i) => (
                      <li
                        key={i}
                        className="px-4 py-3 hover:bg-[var(--am-field)] cursor-pointer text-sm text-[var(--am-ink)] border-b border-[var(--am-line)] last:border-0"
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

                <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const sampleCities = language === "vi"
                        ? ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Đà Lạt"]
                        : ["New York", "London", "Paris", "Tokyo", "Sydney", "Hanoi"];
                      setCity(sampleCities[Math.floor(Math.random() * sampleCities.length)]);
                    }}
                    className={linkBtn}
                  >
                    {t("home.hero.manual_coords")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExtended(!showExtended)}
                    aria-expanded={showExtended}
                    className="text-sm text-[var(--am-muted)] hover:text-[var(--am-ink)]"
                  >
                    {showExtended ? t("home.hero.hide_extended") : t("home.hero.show_extended")}
                  </button>
                </div>
              </div>

              {showExtended && (
                <div className="p-4 bg-[var(--am-field)] rounded-2xl">
                  <label htmlFor="hero-house" className={label}>{t("home.hero.house_system")}</label>
                  <select
                    id="hero-house"
                    value={houseSystem}
                    onChange={(e) => setHouseSystem(e.target.value as "placidus" | "koch" | "whole_sign" | "equal")}
                    className={`${field} bg-[var(--am-surface)]`}
                  >
                    <option value="placidus">{t("system.placidus")}</option>
                    <option value="whole_sign">{t("system.whole_sign")}</option>
                    <option value="koch">{t("system.koch")}</option>
                    <option value="equal">{t("system.equal")}</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 rounded-2xl bg-[var(--am-primary)] text-[var(--am-primary-ink)] text-base font-bold shadow-lg shadow-[var(--am-primary)]/30 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 disabled:opacity-60 disabled:hover:translate-y-0 transition cursor-pointer"
              >
                {isLoading ? t("home.hero.btn_loading") : t("home.hero.btn_submit")}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
