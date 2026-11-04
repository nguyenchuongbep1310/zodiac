"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/lib/hooks/useI18n";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function TopNav() {
  const pathname = usePathname();
  const { t, language, setLanguage, localeHref } = useTranslation();

  const navItems = [
    { label: t("nav.features"), href: "/dashboard" },
    { label: t("nav.astrology"), href: "/learn/birth-chart/planets" },
    { label: t("nav.faq"), href: "/learn" },
  ];

  return (
    <div className="w-full flex justify-center sticky top-4 z-40 px-4 mb-8">
      <header className="flex items-center justify-between px-6 py-2.5 w-full max-w-5xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/10 shadow-lg shadow-black/5 transition-all duration-300">
        
        {/* Logo */}
        <BrandLogo size="md" />

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={localeHref(href)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white",
                  active ? "text-slate-900 dark:text-white font-semibold" : "text-slate-600 dark:text-slate-400"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-full border border-black/5 dark:border-white/10 text-xs font-semibold">
            <button
              onClick={() => setLanguage("en")}
              className={cn(
                "px-3 py-1 rounded-full transition-all",
                language === "en" ? "bg-[var(--am-ink)] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              English
            </button>
            <button
              onClick={() => setLanguage("vi")}
              className={cn(
                "px-3 py-1 rounded-full transition-all",
                language === "vi" ? "bg-[var(--am-ink)] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              )}
            >
              Tiếng Việt
            </button>
          </div>

          <ThemeToggle />
        </div>
        
      </header>
    </div>
  );
}
