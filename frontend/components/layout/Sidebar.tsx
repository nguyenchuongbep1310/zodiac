"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Star,
  LogOut,
  Menu,
  X,
  Settings,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTranslation } from "@/lib/hooks/useI18n";
import { useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, userEmail } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), href: "/dashboard" },
    { icon: User, label: t("nav.profiles"), href: "/profiles" },
    { icon: Star, label: t("nav.charts"), href: "/charts" },
  ];

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-space-600/50">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-gradient shadow-glow">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-lg font-bold text-white tracking-wider">Zodiac</h1>
          <p className="text-xs text-slate-500">Astrology Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-glow"
                  : "text-slate-400 hover:text-slate-200 hover:bg-space-700 border border-transparent"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? "text-violet-400" : "text-slate-500")} />
              {label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-space-600/50 p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 mb-1">
          <div className="h-8 w-8 rounded-full bg-violet-gradient flex items-center justify-center text-white text-xs font-bold">
            {userEmail ? userEmail[0].toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate">{userEmail || "User"}</p>
            <p className="text-xs text-slate-500">Astrologer</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 min-h-screen border-r border-space-700/50 bg-space-900/80 backdrop-blur-sm">
        <NavContent />
      </aside>

      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-space-800/90 border border-space-600/50 text-slate-400 hover:text-white shadow-glass backdrop-blur-sm"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 z-50 flex h-full w-72 flex-col bg-space-900 border-r border-space-700/50 shadow-2xl animate-slide-up">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
            <NavContent />
          </aside>
        </>
      )}
    </>
  );
}
