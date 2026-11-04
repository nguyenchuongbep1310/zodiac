"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Search, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCalculateChart } from "@/lib/hooks/useCharts";
import { Button } from "@/components/ui/Button";
import { TarotCard } from "@/components/ui/TarotCard";
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

  const label = "mono-label mb-1.5 block font-bold text-[var(--am-ink)]";
  const field =
    "w-full h-12 rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] bg-[var(--am-field)] px-4 text-base text-[var(--am-ink)] placeholder:text-[var(--am-muted)]/70 disabled:opacity-50 transition-colors";
  const icon = "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--am-muted)]";
  const linkBtn = "text-sm font-semibold text-[var(--am-primary)] underline decoration-2 underline-offset-4";

  return (
    <section id="hero" className="relative w-full overflow-hidden pt-28 pb-16 sm:pt-32 md:pb-24">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-start gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center lg:text-left"
        >
          <p className="mono-label inline-block border-y-2 border-dashed border-[var(--am-edge)] py-1 font-bold text-[var(--am-ink)]">
            {t("home.hero.eyebrow")}
          </p>
          <h1 className="font-display mt-6 text-[2.4rem] leading-[1.15] text-[var(--am-ink)] sm:text-5xl lg:text-6xl">
            {titleLead}
            {titleHighlight && (
              <>
                {" "}
                <span
                  data-highlight
                  className="bg-[var(--am-gold)] px-2 text-[#1c1410] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
                >
                  {titleHighlight}
                </span>
              </>
            )}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[var(--am-muted)] sm:text-xl lg:mx-0">
            {t("home.hero.desc")}
          </p>
          <p className="mono-label mt-6 text-[var(--am-muted)]">✓ {t("home.hero.trust")}</p>

          <TarotCard numeral="I" title={t("home.hero.card_title")} tilt={-3} className="mt-10 hidden w-64 lg:block">
            <svg
              viewBox="0 0 200 200"
              role="img"
              aria-label="Natal chart wheel preview"
              className="w-full text-[var(--am-ink)]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="100" cy="100" r="92" strokeWidth="2.4" />
              <circle cx="100" cy="100" r="72" />
              <circle cx="100" cy="100" r="26" fill="var(--am-lilac)" />
              {Array.from({ length: 12 }, (_, i) => {
                const a = (i * 30 * Math.PI) / 180;
                const at = (r: number) => `${(100 + r * Math.cos(a)).toFixed(2)}`;
                const aty = (r: number) => `${(100 + r * Math.sin(a)).toFixed(2)}`;
                return <line key={i} x1={at(26)} y1={aty(26)} x2={at(92)} y2={aty(92)} strokeWidth={i % 3 === 0 ? 2 : 1} />;
              })}
              <path d="M100 40 L152 130 L48 130 Z" stroke="var(--am-teal)" strokeWidth="2" />
              <path d="M48 130 L152 70 L100 160" stroke="var(--am-sunset)" strokeWidth="2" />
              <circle cx="100" cy="40" r="7" fill="var(--am-gold)" />
              <circle cx="152" cy="130" r="7" fill="var(--am-primary)" />
              <circle cx="48" cy="130" r="7" fill="var(--am-surface)" />
              <circle cx="152" cy="70" r="5" fill="var(--am-sunset)" />
            </svg>
          </TarotCard>
        </motion.div>

        {/* The form is a ticket: title block, perforation, then the stub with the fields. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="ink-border hard-shadow relative bg-[var(--am-surface)]"
        >
          <div className="px-5 pb-5 pt-6 sm:px-8">
            <h2 className="font-display text-2xl text-[var(--am-ink)]">{t("home.hero.form_title")}</h2>
          </div>
          <div data-perforation className="relative border-t-2 border-dashed border-[var(--am-edge)]">
            <span
              aria-hidden="true"
              className="absolute -left-[2px] -top-3 h-6 w-3 rounded-r-[12px] border-2 border-l-0 border-[var(--am-edge)] bg-[var(--am-bg)]"
            />
            <span
              aria-hidden="true"
              className="absolute -right-[2px] -top-3 h-6 w-3 rounded-l-[12px] border-2 border-r-0 border-[var(--am-edge)] bg-[var(--am-bg)]"
            />
          </div>

          <form onSubmit={handleStart} className="space-y-4 px-5 pb-6 pt-6 sm:px-8 sm:pb-8">
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

            <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--am-ink)]">
              <input
                type="checkbox"
                checked={unknownTime}
                onChange={(e) => setUnknownTime(e.target.checked)}
                className="h-4 w-4 accent-[var(--am-primary)]"
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
                <ul className="absolute z-50 mt-2 max-h-56 w-full overflow-hidden overflow-y-auto rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] bg-[var(--am-surface)] text-left shadow-[var(--am-shadow)]">
                  {geoResults.map((result, i) => (
                    <li
                      key={i}
                      className="cursor-pointer border-b border-[var(--am-line)] px-4 py-3 text-sm text-[var(--am-ink)] last:border-0 hover:bg-[var(--am-lilac)]"
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

              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
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
              <div className="rounded-[var(--am-radius)] border-2 border-dashed border-[var(--am-edge)] bg-[var(--am-field)] p-4">
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

            <Button type="submit" size="lg" fullWidth isLoading={isLoading}>
              {isLoading ? t("home.hero.btn_loading") : t("home.hero.btn_submit")}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
