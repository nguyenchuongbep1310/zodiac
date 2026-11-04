"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";
import { Ornament } from "@/components/ui/Ornament";

/** "Why AstroMind" as a service menu: name, dotted leader, price tag, small print. */
export function CapableSection() {
  const { t, language } = useTranslation();
  const price = language === "vi" ? "0đ" : "FREE";

  return (
    <section id="astrology" className="px-4 py-20 sm:px-6 md:py-24">
      <div className="ink-border hard-shadow mx-auto max-w-3xl bg-[var(--am-surface)] px-5 py-10 sm:px-12">
        <p className="mono-label text-center font-bold text-[var(--am-muted)]">— MENU —</p>
        <h2 className="font-display mt-3 text-center text-3xl text-[var(--am-ink)] md:text-4xl">{t("home.capable.title")}</h2>
        <p className="mx-auto mt-3 max-w-md text-center text-[var(--am-muted)]">{t("home.capable.subtitle")}</p>
        <Ornament className="my-8" />

        <ul className="space-y-7">
          {[1, 2, 3, 4].map((n, i) => (
            <motion.li
              key={n}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <div className="flex items-baseline gap-3">
                <h3 className="font-display text-lg text-[var(--am-ink)] sm:text-xl">{t(`home.capable.card${n}.title`)}</h3>
                <span aria-hidden="true" className="min-w-6 flex-1 border-b-2 border-dotted border-[var(--am-edge)]" />
                <span className="mono-label font-bold text-[var(--am-primary)]">{price}</span>
              </div>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[var(--am-muted)]">{t(`home.capable.card${n}.desc`)}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
