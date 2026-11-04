"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function ReadYourSkyCTA() {
  const { t } = useTranslation();

  return (
    <section className="px-4 sm:px-6 pb-20 md:pb-28">
      <div className="relative max-w-6xl mx-auto overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#6d4aff] via-[#8f5cff] to-[#ff8a5c] px-6 py-16 sm:px-12 md:py-20 text-center text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-10 w-72 h-72 rounded-full bg-white/15 blur-2xl" />
        <h2 className="relative font-display text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl mx-auto">
          {t("home.cta.title")}
        </h2>
        <p className="relative mt-4 text-lg md:text-xl text-white/85">{t("home.cta.subtitle")}</p>
        <Link
          href="#hero"
          className="relative mt-8 inline-flex items-center gap-2 rounded-2xl bg-white text-[#17132e] px-7 py-4 text-base font-bold shadow-lg hover:-translate-y-0.5 transition"
        >
          {t("home.cta.button")}
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
