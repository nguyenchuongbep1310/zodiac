"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Search, MapPin, Clock, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateProfile } from "@/lib/hooks/useProfiles";
import { useToast } from "@/components/ui/Toast";
import { ApiError } from "@/lib/types/api";
import tzlookup from "tz-lookup";
import { useTranslation } from "@/lib/hooks/useI18n";

// ─── Validation schema ────────────────────────────────────────────────────────

const schema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format"),
  birth_time: z.string().regex(/^\d{2}:\d{2}$/, "Use HH:MM format"),
  timezone: z.string().min(1, "Timezone is required"),
  city: z.string().min(1, "City is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type FormData = z.infer<typeof schema>;

interface GeoResult {
  display_name: string;
  lat: string;
  lon: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProfileForm() {
  const router = useRouter();
  const createProfile = useCreateProfile();
  const { success, error: toastError } = useToast();
  const [cityQuery, setCityQuery] = useState("");
  const [geoResults, setGeoResults] = useState<GeoResult[]>([]);
  const [geoLoading, setGeoLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  // Geocode via OpenStreetMap Nominatim (free, no API key)
  const searchCity = useCallback(async () => {
    if (!cityQuery.trim()) return;
    setGeoLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityQuery)}&format=json&limit=5`
      );
      const data: GeoResult[] = await res.json();
      setGeoResults(data);
    } catch {
      toastError("Geocoding failed", "Could not search for that city.");
    } finally {
      setGeoLoading(false);
    }
  }, [cityQuery, toastError]);

  const selectCity = (result: GeoResult) => {
    const cityName = result.display_name.split(",")[0];
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    
    setValue("city", cityName, { shouldValidate: true });
    setValue("latitude", lat, { shouldValidate: true });
    setValue("longitude", lon, { shouldValidate: true });
    
    try {
      const tz = tzlookup(lat, lon);
      setValue("timezone", tz, { shouldValidate: true });
    } catch {
      // Fallback if timezone lookup fails
      setValue("timezone", "UTC", { shouldValidate: true });
    }
    
    setGeoResults([]);
    setCityQuery(cityName);
  };

  const onSubmit = async (data: FormData) => {
    try {
      const profile = await createProfile.mutateAsync(data);
      success("Profile created!", `"${profile.name}" is ready.`);
      router.push(`/profiles/${profile.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError("Failed to create profile", err.message);
      } else {
        toastError("Error", "Something went wrong.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <Input
        id="profile-name"
        label={t("profiles.name")}
        placeholder="e.g. John's Chart"
        icon={<User className="h-4 w-4" />}
        error={errors.name?.message}
        {...register("name")}
      />

      {/* Date + Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="profile-birth-date"
          label={t("profiles.date")}
          type="date"
          icon={<Calendar className="h-4 w-4" />}
          error={errors.birth_date?.message}
          {...register("birth_date")}
        />
        <Input
          id="profile-birth-time"
          label={t("profiles.time")}
          type="time"
          icon={<Clock className="h-4 w-4" />}
          error={errors.birth_time?.message}
          {...register("birth_time")}
        />
      </div>

      {/* Hidden timezone field (auto-calculated) */}
      <input type="hidden" {...register("timezone")} />

      {/* City geocoding search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          {t("profiles.city")}
        </label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <MapPin className="h-4 w-4" />
            </div>
            <input
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), searchCity())}
              placeholder={t("profiles.search_city")}
              className="w-full rounded-xl border border-space-500/50 bg-space-800/60 pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={searchCity}
            isLoading={geoLoading}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Results dropdown */}
        {geoResults.length > 0 && (
          <div className="rounded-xl border border-space-500/50 bg-space-800 overflow-hidden shadow-glass">
            {geoResults.map((r, i) => (
              <button
                key={i}
                type="button"
                onClick={() => selectCity(r)}
                className="w-full text-left px-4 py-3 text-sm text-slate-200 hover:bg-space-700 border-b border-space-700/50 last:border-0 transition-colors"
              >
                {r.display_name}
              </button>
            ))}
          </div>
        )}
        {errors.city && <p className="text-xs text-rose-400">{errors.city.message}</p>}

        {/* Hidden fields for lat/lng */}
        <input type="hidden" {...register("latitude", { valueAsNumber: true })} />
        <input type="hidden" {...register("longitude", { valueAsNumber: true })} />
        <input type="hidden" {...register("city")} />
      </div>

      {/* Coordinate display (read-only after selection) */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="profile-lat"
          label="Latitude"
          type="number"
          step="any"
          placeholder="e.g. 40.7128"
          error={errors.latitude?.message}
          {...register("latitude", { valueAsNumber: true })}
        />
        <Input
          id="profile-lon"
          label="Longitude"
          type="number"
          step="any"
          placeholder="e.g. -74.0060"
          error={errors.longitude?.message}
          {...register("longitude", { valueAsNumber: true })}
        />
      </div>

      <Button
        type="submit"
        fullWidth
        size="lg"
        isLoading={createProfile.isPending}
      >
        {t("profiles.submit")}
      </Button>
    </form>
  );
}
