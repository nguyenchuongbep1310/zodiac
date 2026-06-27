"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, MapPin, Clock, Calendar, Star, Sparkles } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfiles";
import { useCalculateChart } from "@/lib/hooks/useCharts";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/types/api";
import { useTranslation } from "@/lib/hooks/useI18n";

interface ProfileDetailClientProps {
  id: string;
}

export function ProfileDetailClient({ id }: ProfileDetailClientProps) {
  const router = useRouter();
  const { data: profile, isLoading, error } = useProfile(id);
  const calculateChart = useCalculateChart();
  const { success, error: toastError } = useToast();
  const [houseSystem, setHouseSystem] = useState<"placidus" | "whole_sign">("placidus");
  const { t } = useTranslation();

  const handleCalculate = async () => {
    if (!profile) return;
    try {
      const chart = await calculateChart.mutateAsync({
        profile_id: profile.id,
        house_system: houseSystem,
        zodiac_system: "tropical",
      });
      success("Chart calculated!", "Redirecting to your natal chart.");
      router.push(`/charts/${chart.id}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toastError("Calculation failed", err.message);
      } else {
        toastError("Error", "Could not calculate the chart.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-rose-400 font-medium">{t("profiles.not_found")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/profiles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("profiles.back")}
      </Link>

      {/* Profile header */}
      <Card glow>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-violet-gradient flex items-center justify-center font-display font-bold text-white text-2xl shadow-glow">
              {profile.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100">{profile.name}</h1>
              <Badge variant="violet" className="mt-1">Birth Profile</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-space-800/60 border border-space-600/30">
              <Calendar className="h-4 w-4 text-violet-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{t("profiles.date")}</p>
                <p className="text-sm font-medium text-slate-200">{profile.birth_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-space-800/60 border border-space-600/30">
              <Clock className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{t("profiles.time")}</p>
                <p className="text-sm font-medium text-slate-200">{profile.birth_time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-space-800/60 border border-space-600/30">
              <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-500">{t("profiles.location")}</p>
                <p className="text-sm font-medium text-slate-200">{profile.location.city}</p>
                <p className="text-xs text-slate-500">
                  {profile.location.latitude.toFixed(4)}, {profile.location.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculate chart */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-400" />
            {t("profiles.calculate_chart")}
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              {t("profiles.house_system")}
            </label>
            <div className="flex gap-2 flex-wrap">
              {(["placidus", "whole_sign", "koch", "equal"] as const).map((sys) => (
                <button
                  key={sys}
                  type="button"
                  onClick={() => setHouseSystem(sys as "placidus" | "whole_sign")}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    houseSystem === sys
                      ? "bg-violet-600/30 text-violet-300 border-violet-500/50"
                      : "bg-space-800 text-slate-400 border-space-600/50 hover:border-space-500"
                  }`}
                >
                  {t(`system.${sys}`)}
                </button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleCalculate}
            isLoading={calculateChart.isPending}
            className="w-full sm:w-auto"
          >
            <Star className="h-4 w-4" />
            {t("profiles.calculate_chart")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
