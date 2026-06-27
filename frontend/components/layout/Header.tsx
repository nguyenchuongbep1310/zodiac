"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 px-6 py-4 border-b border-space-700/50 bg-space-900/70 backdrop-blur-md">
      <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {segments.map((seg, i) => {
          const label = t(`nav.${seg}`) !== `nav.${seg}` ? t(`nav.${seg}`) : (seg.length === 36 ? t("nav.detail") : seg);
          const isLast = i === segments.length - 1;
          return (
            <span key={seg} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-600" />}
              <span className={isLast ? "text-slate-200 font-medium" : "text-slate-500"}>
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
            language === "en" ? "bg-violet-500/20 text-violet-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          EN
        </button>
        <span className="text-slate-700 text-xs">|</span>
        <button
          onClick={() => setLanguage("vi")}
          className={`px-2 py-1 text-xs font-medium rounded-md transition-colors ${
            language === "vi" ? "bg-violet-500/20 text-violet-400" : "text-slate-500 hover:text-slate-300"
          }`}
        >
          VI
        </button>
      </div>
    </header>
  );
}
