"use client";

import Link from "next/link";
import { MapPin, Clock, Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { ProfileResponse } from "@/lib/types/api";
import { formatDate } from "@/lib/utils";

interface ProfileCardProps {
  profile: ProfileResponse;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/profiles/${profile.id}`}>
      <Card hover className="group">
        <CardContent className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-12 w-12 shrink-0 rounded-2xl bg-violet-gradient flex items-center justify-center font-display font-bold text-white text-lg shadow-glow">
            {initials}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-100 group-hover:text-violet-300 transition-colors truncate">
              {profile.name}
            </h3>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-violet-400 shrink-0" />
                <span>{profile.birth_date} at {profile.birth_time}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{profile.location.city}</span>
              </div>
            </div>

            <p className="mt-2 text-xs text-slate-600">
              Created {formatDate(profile.created_at)}
            </p>
          </div>

          <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </CardContent>
      </Card>
    </Link>
  );
}
