"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto rounded-[2rem] bg-[var(--am-surface)] border border-[var(--am-line)] p-6 sm:p-10 md:p-14">
        <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--am-ink)] mb-10 md:mb-12">
          {t("home.steps.title")}
        </h2>
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[1, 2, 3].map((n, i) => (
            <motion.li
              key={n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <span className="font-display text-5xl font-extrabold am-gradient-text" aria-hidden="true">
                0{n}
              </span>
              <h3 className="mt-3 text-xl font-bold text-[var(--am-ink)]">{t(`home.steps.s${n}.title`)}</h3>
              <p className="mt-2 text-[var(--am-muted)] leading-relaxed">{t(`home.steps.s${n}.desc`)}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
