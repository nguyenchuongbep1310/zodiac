import type { Metadata } from "next";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "New Birth Profile",
  description: "Create a new birth profile to calculate a natal chart.",
};

export default function NewProfilePage() {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <Link
        href="/profiles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors mb-6"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to profiles
      </Link>

      <Card glow>
        <CardHeader>
          <h1 className="text-xl font-semibold text-slate-100">New birth profile</h1>
          <p className="text-sm text-slate-400 mt-1">
            Enter birth details to calculate a natal chart.
          </p>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
