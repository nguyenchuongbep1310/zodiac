"use client";

import { motion } from "framer-motion";
import { Sun, HeartHandshake, Orbit, MoonStar, Users } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function BentoFeatures() {
  const { t } = useTranslation();

  const cards = [
    { n: 1, icon: Sun, className: "md:col-span-2 md:row-span-2 bg-[var(--am-primary)] text-[var(--am-primary-ink)]", big: true },
    { n: 2, icon: HeartHandshake, className: "md:col-span-2 bg-[var(--am-peach)] text-[var(--am-ink)]" },
    { n: 3, icon: Orbit, className: "bg-[var(--am-mint)] text-[var(--am-ink)]" },
    { n: 4, icon: MoonStar, className: "bg-[var(--am-ink)] text-[var(--am-bg)]" },
    { n: 5, icon: Users, className: "md:col-span-4 bg-[var(--am-lilac)] text-[var(--am-ink)]" },
  ];

  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl mb-10 md:mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--am-ink)]">
            {t("home.bento.title")}
          </h2>
          <p className="mt-4 text-lg text-[var(--am-muted)]">{t("home.bento.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[minmax(190px,auto)]">
          {cards.map(({ n, icon: Icon, className, big }, i) => (
            <motion.article
              key={n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className={`rounded-[1.75rem] p-6 sm:p-8 flex flex-col justify-between gap-6 ${className}`}
            >
              <span className="grid place-items-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className={`font-display font-bold tracking-tight ${big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>
                  {t(`home.bento.card${n}.title`)}
                </h3>
                <p className={`mt-2 leading-relaxed opacity-85 ${big ? "text-lg max-w-md" : "text-base"}`}>
                  {t(`home.bento.card${n}.desc`)}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
