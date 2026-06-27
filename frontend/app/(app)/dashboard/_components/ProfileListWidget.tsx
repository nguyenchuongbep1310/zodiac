"use client";

import { useProfiles } from "@/lib/hooks/useProfiles";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { Spinner } from "@/components/ui/Spinner";

export function ProfileListWidget() {
  const { data, isLoading, error } = useProfiles();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (error || !data || data.data.length === 0) {
    return (
      <div className="rounded-2xl border border-space-700/50 bg-space-800/40 p-8 text-center">
        <p className="text-3xl mb-3">✦</p>
        <p className="text-slate-400 text-sm">No birth profiles yet.</p>
        <p className="text-slate-500 text-xs mt-1">Create one to calculate your first chart.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.data.slice(0, 6).map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
