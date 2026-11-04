"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";
import { Ornament } from "@/components/ui/Ornament";

/** Closing call to action: a full-bleed oxblood (gold in dark) block. */
export function ReadYourSkyCTA() {
  const { t } = useTranslation();

  return (
    <section className="[--focus-ring:var(--am-bg)] border-t-2 border-[var(--am-edge)] bg-[var(--am-primary)] px-4 py-20 text-[var(--am-primary-ink)] sm:px-6 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-4xl text-center"
      >
        <Ornament className="mx-auto mb-8 max-w-xs text-current" />
        <h2 className="font-display text-4xl leading-[1.15] md:text-6xl">{t("home.cta.title")}</h2>
        <p className="mt-5 text-lg opacity-90 md:text-xl">{t("home.cta.subtitle")}</p>
        <Link
          href="#hero"
          className="mono-label mt-10 inline-flex items-center gap-2 rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] bg-[var(--am-bg)] px-7 py-4 text-sm font-bold text-[var(--am-ink)] shadow-[var(--am-shadow)] transition-colors hover:bg-[var(--am-gold)] hover:text-[#1c1410] active:[transform:translate(3px,3px)] active:shadow-[1px_1px_0_var(--am-edge)]"
        >
          {t("home.cta.button")}
          <span aria-hidden="true">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
