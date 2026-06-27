import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProfilesClient } from "./_components/ProfilesClient";

export const metadata: Metadata = {
  title: "Birth Profiles",
  description: "Manage your birth profiles and natal charts.",
};

export default function ProfilesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Birth Profiles</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage the birth data used to calculate natal charts.
          </p>
        </div>
        <Link href="/profiles/new">
          <Button>
            <Plus className="h-4 w-4" />
            New profile
          </Button>
        </Link>
      </div>
      <ProfilesClient />
    </div>
  );
}
