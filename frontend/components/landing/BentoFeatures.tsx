"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";
import { TarotCard } from "@/components/ui/TarotCard";

// One card per feature, drawn from the same i18n keys as before (home.bento.card1..5).
const CARDS = [
  { n: 1, numeral: "I", glyph: "☉", tilt: -2 },
  { n: 2, numeral: "II", glyph: "♀\uFE0E", tilt: 1.5 },
  { n: 3, numeral: "III", glyph: "◎", tilt: -1 },
  { n: 4, numeral: "IV", glyph: "☽", tilt: 2 },
  { n: 5, numeral: "V", glyph: "✦", tilt: -1.5 },
];

/** "Pull a card": the features laid out as a spread of tarot cards. */
export function BentoFeatures() {
  const { t } = useTranslation();

  return (
    <section id="features" className="overflow-x-clip px-4 py-20 sm:px-6 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl text-[var(--am-ink)] md:text-5xl">{t("home.bento.title")}</h2>
          <p className="mt-4 text-lg text-[var(--am-muted)]">{t("home.bento.subtitle")}</p>
        </div>

        <div className="mt-14 flex flex-wrap items-stretch justify-center gap-x-8 gap-y-10">
          {CARDS.map(({ n, numeral, glyph, tilt }, i) => (
            <motion.div
              key={n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              className="w-full sm:w-[17rem]"
            >
              <TarotCard numeral={numeral} title={t(`home.bento.card${n}.title`)} tilt={tilt} className="h-full">
                <div className="text-center">
                  <div className="font-display text-6xl text-[var(--am-primary)]" aria-hidden="true">
                    {glyph}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--am-ink)]">{t(`home.bento.card${n}.desc`)}</p>
                </div>
              </TarotCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
