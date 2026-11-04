"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/hooks/useI18n";
import { ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  const { language, localeHref } = useTranslation();

  return (
    <div className="min-h-[100dvh] bg-[var(--am-bg)] flex items-center justify-center px-4 transition-colors">
      <div className="text-center animate-fade-in max-w-md p-8 rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] dark:border-white/10 shadow-xl">
        <div className="text-6xl mb-4 font-display font-extrabold tracking-tight text-[var(--am-primary)]">404</div>
        <div className="text-3xl mb-4 text-[var(--am-primary)]">✦</div>
        <h1 className="text-2xl font-display font-extrabold tracking-tight text-[var(--am-ink)] mb-2">
          {language === "vi" ? "Không Tìm Thấy Trang" : "Page Not Found"}
        </h1>
        <p className="text-[var(--am-muted)] mb-8 text-sm font-light leading-relaxed">
          {language === "vi"
            ? "Thiên thể này dường như đã trôi ra khỏi tầm quan sát. Hãy để các vì sao dẫn lối bạn quay về."
            : "This celestial body has drifted out of our reach. Let the stars guide you back."}
        </p>
        <Link
          href={localeHref("/")}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--am-primary)] hover:opacity-90 px-6 py-3 text-sm font-semibold text-[var(--am-bg)] transition-all shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === "vi" ? "Quay lại trang chủ" : "Return to home"}
        </Link>
      </div>
    </div>
  );
}
