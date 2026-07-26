"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/lib/hooks/useI18n";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

export function TopNav() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useTranslation();

  const navItems: { label: string; href: string }[] = [];

  return (
    <div className="w-full flex justify-center sticky top-4 z-40 px-4 mb-8">
      <header className="flex items-center justify-between px-6 py-3 w-full max-w-4xl bg-white/5 dark:bg-white/[0.03] backdrop-blur-lg rounded-full border border-black/10 dark:border-white/10 transition-all duration-300">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600">
            <Star className="h-4 w-4 text-white" />
          </div>
          <h1 className="font-display text-xl font-bold text-slate-800 dark:text-white tracking-wider">Zodiac</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ href, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-amber-600 dark:hover:text-amber-400",
                  active ? "text-amber-600 dark:text-amber-400" : "text-slate-600 dark:text-slate-300"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-medium bg-black/5 dark:bg-black/20 p-1 rounded-full border border-black/10 dark:border-white/5">
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-1.5 rounded-full transition-colors",
                language === "en" ? "bg-white shadow-sm text-amber-600 dark:bg-white/10 dark:text-amber-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("vi")}
              className={cn(
                "px-3 py-1.5 rounded-full transition-colors",
                language === "vi" ? "bg-white shadow-sm text-amber-600 dark:bg-white/10 dark:text-amber-400" : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              )}
            >
              VI
            </button>
          </div>
          <ThemeToggle />
        </div>
        
      </header>
    </div>
  );
}
