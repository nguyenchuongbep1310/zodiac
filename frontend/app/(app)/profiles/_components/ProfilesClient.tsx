"use client";

import { useProfiles } from "@/lib/hooks/useProfiles";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Spinner } from "@/components/ui/Spinner";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export function ProfilesClient() {
  const { data, isLoading, error } = useProfiles();

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
        <p className="text-rose-400 font-medium">Failed to load profiles</p>
        <p className="text-slate-500 text-sm mt-1">Please refresh the page.</p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-3xl border border-space-700/50 bg-space-800/40 p-16 text-center">
        <div className="text-5xl mb-4">✦</div>
        <h3 className="text-slate-300 font-medium text-lg">No profiles yet</h3>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          Create your first birth profile to calculate a natal chart.
        </p>
        <Link href="/profiles/new">
          <Button>
            <Plus className="h-4 w-4" /> Create your first profile
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-slate-500">{data.total} profile{data.total !== 1 ? "s" : ""}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.data.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </div>
  );
}
