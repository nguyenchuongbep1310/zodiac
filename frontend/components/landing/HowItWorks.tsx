"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";
import { Stamp } from "@/components/ui/Stamp";

const NUMERALS = ["I", "II", "III"];

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="border-y-2 border-[var(--am-edge)] bg-[var(--am-surface)] px-4 py-16 sm:px-6 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-12 text-center text-3xl text-[var(--am-ink)] md:text-5xl">{t("home.steps.title")}</h2>
        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Dashed route linking the three stamps */}
          <div
            aria-hidden="true"
            className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-[var(--am-edge)] md:block"
          />
          {NUMERALS.map((numeral, i) => (
            <motion.li
              key={numeral}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative text-center"
            >
              <Stamp className="mx-auto h-16 w-16 bg-[var(--am-surface)] text-xl font-bold">{numeral}</Stamp>
              <h3 className="font-display mt-5 text-xl text-[var(--am-ink)]">{t(`home.steps.s${i + 1}.title`)}</h3>
              <p className="mx-auto mt-2 max-w-xs leading-relaxed text-[var(--am-muted)]">{t(`home.steps.s${i + 1}.desc`)}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
