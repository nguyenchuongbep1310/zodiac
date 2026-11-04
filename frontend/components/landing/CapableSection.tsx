"use client";

import { motion } from "framer-motion";
import { GraduationCap, Layers, Target, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

const ICONS = [GraduationCap, Layers, Target, SlidersHorizontal];

export function CapableSection() {
  const { t } = useTranslation();

  return (
    <section id="astrology" className="py-20 md:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--am-ink)]">
            {t("home.capable.title")}
          </h2>
          <p className="mt-4 text-lg text-[var(--am-muted)]">{t("home.capable.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ICONS.map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="rounded-[1.5rem] bg-[var(--am-surface)] border border-[var(--am-line)] p-6 hover:-translate-y-1 hover:shadow-lg transition"
            >
              <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--am-lilac)] text-[var(--am-primary)]">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-lg font-bold text-[var(--am-ink)]">{t(`home.capable.card${i + 1}.title`)}</h3>
              <p className="mt-2 text-[var(--am-muted)] leading-relaxed">{t(`home.capable.card${i + 1}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
