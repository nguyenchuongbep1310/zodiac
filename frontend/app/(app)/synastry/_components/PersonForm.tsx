"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, MapPin as MapPinIcon, Search, User } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export interface PersonDetails {
  name: string;
  city: string;
  date: string;
  time: string;
  unknownTime: boolean;
}

interface PersonFormProps {
  label: string;
  value: PersonDetails;
  onChange: (value: PersonDetails) => void;
  accent: "violet" | "amber";
}

const ACCENT_RING: Record<string, string> = {
  violet: "focus:ring-[#8C6E8A]",
  amber: "focus:ring-[#C2A066]",
};

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

export function PersonForm({ label, value, onChange, accent }: PersonFormProps) {
  const { t, language } = useTranslation();
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (value.city.length <= 2 || !showDropdown) {
      return;
    }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value.city)}&format=json&limit=5`
        );
        const data: GeoResult[] = await res.json();
        setGeoResults(data);
      } catch {
        setGeoResults([]);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [value.city, showDropdown]);

  const update = (patch: Partial<PersonDetails>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="text-base font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-2 block">
          {label} — {language === "vi" ? "Tên (tùy chọn)" : "Name (optional)"}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#947E70]" />
          <input
            type="text"
            value={value.name}
            onChange={(e) => update({ name: e.target.value })}
            placeholder={language === "vi" ? "Ví dụ: An" : "e.g. Alex"}
            className={`w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] placeholder-[#A8988C] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[#B5A499]/60 dark:hover:border-white/20`}
          />
        </div>
      </div>

      {/* Birth Date */}
      <div>
        <label className="text-base font-semibold text-[#5C4033] dark:text-[#E8DDD3] mb-2 block">
          {t("home.hero.date_label")}
        </label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#947E70]" />
          <input
            type="date"
            value={value.date}
            onChange={(e) => update({ date: e.target.value })}
            required
            className={`w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[#B5A499]/60 dark:hover:border-white/20`}
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
            value={value.time}
            disabled={value.unknownTime}
            onChange={(e) => update({ time: e.target.value })}
            required={!value.unknownTime}
            className={`w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all disabled:opacity-50 hover:border-[#B5A499]/60 dark:hover:border-white/20`}
          />
        </div>
        <label className="flex items-center gap-2 mt-2.5 cursor-pointer text-sm text-[#7A6E65] dark:text-[#A8988C]">
          <input
            type="checkbox"
            checked={value.unknownTime}
            onChange={(e) => update({ unknownTime: e.target.checked })}
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
            value={value.city}
            onChange={(e) => {
              update({ city: e.target.value });
              if (e.target.value.length <= 2) setGeoResults([]);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => { setShowDropdown(false); setGeoResults([]); }, 200)}
            placeholder={t("home.hero.location_placeholder")}
            required
            autoComplete="off"
            className={`w-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[#4A3525] dark:text-[#E8DDD3] placeholder-[#A8988C] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[#B5A499]/60 dark:hover:border-white/20`}
          />
        </div>

        {showDropdown && geoResults.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-[#FAF7F2] dark:bg-[#1E1915] border border-[#E5DCD0] dark:border-white/10 rounded-2xl shadow-xl overflow-hidden text-left max-h-56 overflow-y-auto">
            {geoResults.map((result, i) => (
              <li
                key={i}
                className="px-5 py-3 hover:bg-[#F0E6D8] dark:hover:bg-white/5 cursor-pointer text-sm text-[#5C4033] dark:text-[#E8DDD3] border-b border-[#EBE4D8] dark:border-white/5 last:border-0 flex items-start gap-2"
                onClick={() => {
                  update({ city: result.display_name.split(",")[0] });
                  setShowDropdown(false);
                }}
              >
                <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-[#947E70]" />
                <span>{result.display_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
