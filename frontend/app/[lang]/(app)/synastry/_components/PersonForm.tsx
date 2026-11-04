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
  violet: "focus:ring-[var(--am-primary)]",
  amber: "focus:ring-[var(--am-sunset)]",
};

import { searchCities } from "@/lib/utils/geocode";

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
    if (value.city.length < 2 || !showDropdown) {
      return;
    }
    const timeout = setTimeout(async () => {
      const data = await searchCities(value.city);
      setGeoResults(data);
    }, 300);
    return () => clearTimeout(timeout);
  }, [value.city, showDropdown]);

  const update = (patch: Partial<PersonDetails>) => onChange({ ...value, ...patch });

  return (
    <div className="space-y-5">
      {/* Name */}
      <div>
        <label className="text-base font-semibold text-[var(--am-ink)] mb-2 block">
          {label} — {t("home.hero.name_label")}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--am-muted)]" />
          <input
            type="text"
            value={value.name}
            maxLength={100}
            onChange={(e) => update({ name: e.target.value })}
            placeholder={t("home.hero.name_placeholder")}
            className={`w-full bg-[var(--am-field)] border-2 border-[var(--am-edge)] rounded-[var(--am-radius)] py-3.5 pl-12 pr-4 text-[var(--am-ink)] placeholder-[var(--am-muted)] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[var(--am-primary)]/60`}
          />
        </div>
      </div>

      {/* Birth Date */}
      <div>
        <label className="text-base font-semibold text-[var(--am-ink)] mb-2 block">
          {t("home.hero.date_label")}
        </label>
        <div className="relative">
          <Calendar className="hidden sm:block pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--am-muted)]" />
          <input
            type="date"
            value={value.date}
            onChange={(e) => update({ date: e.target.value })}
            required
            className={`w-full bg-[var(--am-field)] border-2 border-[var(--am-edge)] rounded-[var(--am-radius)] py-3.5 pl-4 sm:pl-12 pr-4 text-[var(--am-ink)] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[var(--am-primary)]/60`}
          />
        </div>
      </div>

      {/* Birth Time */}
      <div>
        <label className="text-base font-semibold text-[var(--am-ink)] mb-2 block">
          {t("home.hero.time_label")}
        </label>
        <div className="relative">
          <Clock className="hidden sm:block pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--am-muted)]" />
          <input
            type="time"
            value={value.time}
            disabled={value.unknownTime}
            onChange={(e) => update({ time: e.target.value })}
            required={!value.unknownTime}
            className={`w-full bg-[var(--am-field)] border-2 border-[var(--am-edge)] rounded-[var(--am-radius)] py-3.5 pl-4 sm:pl-12 pr-4 text-[var(--am-ink)] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all disabled:opacity-50 hover:border-[var(--am-primary)]/60`}
          />
        </div>
        <label className="flex items-center gap-2 mt-2.5 cursor-pointer text-sm text-[var(--am-muted)]">
          <input
            type="checkbox"
            checked={value.unknownTime}
            onChange={(e) => update({ unknownTime: e.target.checked })}
            className="rounded border-[var(--am-line)] text-[var(--am-muted)] focus:ring-0 w-4 h-4"
          />
          <span>{t("home.hero.unknown_time")}</span>
        </label>
      </div>

      {/* Birth Location */}
      <div className="relative">
        <label className="text-base font-semibold text-[var(--am-ink)] mb-2 block">
          {t("home.hero.location_label")}
        </label>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--am-muted)] pointer-events-none" />
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
            className={`w-full bg-[var(--am-field)] border-2 border-[var(--am-edge)] rounded-[var(--am-radius)] py-3.5 pl-12 pr-4 text-[var(--am-ink)] placeholder-[var(--am-muted)] text-base focus:outline-none focus:ring-2 ${ACCENT_RING[accent]} transition-all hover:border-[var(--am-primary)]/60`}
          />
        </div>

        {showDropdown && geoResults.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-[var(--am-surface)] dark:bg-[var(--am-field)] border-2 border-[var(--am-edge)] rounded-[var(--am-radius)] shadow-[var(--am-shadow)] overflow-hidden text-left max-h-56 overflow-y-auto">
            {geoResults.map((result, i) => (
              <li
                key={i}
                className="px-5 py-3 hover:bg-[var(--am-field)] cursor-pointer text-sm text-[var(--am-ink)] border-b border-[var(--am-line)] last:border-0 flex items-start gap-2"
                onClick={() => {
                  update({ city: result.display_name.split(",")[0] });
                  setShowDropdown(false);
                }}
              >
                <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-[var(--am-muted)]" />
                <span>{result.display_name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
