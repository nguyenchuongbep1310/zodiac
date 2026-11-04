"use client";

import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { t, language, setLanguage } = useTranslation();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 px-6 py-4 border-b border-[var(--am-surface)] bg-[var(--am-surface)]">
      <nav className="flex items-center gap-1 text-sm" aria-label="Breadcrumb">
        {segments.map((seg, i) => {
          const label = t(`nav.${seg}`) !== `nav.${seg}` ? t(`nav.${seg}`) : (seg.length === 36 ? t("nav.detail") : seg);
          const isLast = i === segments.length - 1;
          return (
            <span key={seg} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-[var(--am-teal)]" />}
              <span className={isLast ? "text-[var(--am-teal)] font-medium" : "text-[var(--am-teal)]"}>
                {label}
              </span>
            </span>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 text-xs font-medium rounded-[var(--am-radius)] transition-colors ${
            language === "en" ? "bg-[var(--am-peach)] text-[var(--am-primary)]" : "text-[var(--am-teal)] hover:text-[var(--am-teal)]"
          }`}
        >
          EN
        </button>
        <span className="text-[var(--am-teal)] text-xs">|</span>
        <button
          onClick={() => setLanguage("vi")}
          className={`px-2 py-1 text-xs font-medium rounded-[var(--am-radius)] transition-colors ${
            language === "vi" ? "bg-[var(--am-peach)] text-[var(--am-primary)]" : "text-[var(--am-teal)] hover:text-[var(--am-teal)]"
          }`}
        >
          VI
        </button>
        <span className="text-[var(--am-teal)] text-xs ml-1 mr-1">|</span>
        <ThemeToggle />
      </div>
    </header>
  );
}
