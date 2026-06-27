import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Star, User, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { ProfileListWidget } from "./_components/ProfileListWidget";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your Zodiac astrology dashboard.",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-space-800/80 to-space-900/80 backdrop-blur-sm p-8">
        <div className="pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display text-3xl font-bold text-gradient tracking-wide">
                Welcome to Zodiac
              </h1>
              <p className="mt-2 text-slate-400 max-w-md">
                Explore your natal chart, discover planetary influences, and understand
                the cosmic patterns shaping your life.
              </p>
            </div>
            <Link href="/profiles/new">
              <Button size="lg">
                <Plus className="h-4 w-4" />
                New profile
              </Button>
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm">
            {[
              { icon: User, label: "Profiles", color: "text-violet-400" },
              { icon: Star, label: "Charts", color: "text-amber-400" },
              { icon: TrendingUp, label: "Aspects", color: "text-emerald-400" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="text-center">
                <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/profiles/new">
          <Card hover className="p-5 group">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                <User className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-200 group-hover:text-violet-300 transition-colors">
                  Add birth profile
                </h3>
                <p className="text-xs text-slate-500">Set up a new chart subject</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/profiles">
          <Card hover className="p-5 group">
            <div className="flex items-center gap-4">
              <div className="h-11 w-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <Star className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3 className="font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
                  View profiles
                </h3>
                <p className="text-xs text-slate-500">Browse all birth profiles</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent profiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-200">Recent profiles</h2>
          <Link href="/profiles" className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
            View all →
          </Link>
        </div>
        <ProfileListWidget />
      </div>
    </div>
  );
}
