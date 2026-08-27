"use client";

import { motion, Variants } from "framer-motion";
import { Star, Map, Compass, BookOpen, Orbit, Sparkles, ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function BentoFeatures() {
  const { t } = useTranslation();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
  };

  return (
    <section id="features" className="py-28 px-6 relative overflow-hidden">
      {/* Subtle decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-[#a67c7e]/5 to-transparent blur-3xl" />
        <div className="absolute bottom-20 left-0 w-[350px] h-[350px] rounded-full bg-gradient-radial from-[#2d4a4e]/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-mystic-dark dark:text-warm-cream mb-4 tracking-tight">
            {t("home.bento.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("home.bento.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[260px]"
        >
          {/* Large Card 1 - Precision Astrology */}
          <motion.div
            variants={item}
            className="md:col-span-2 lg:col-span-2 row-span-2 bg-gradient-to-br from-[#2d4a4e] to-[#1a3538] rounded-3xl p-8 sm:p-10 flex flex-col relative overflow-hidden group shadow-xl hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="absolute top-0 right-0 p-8 opacity-15 group-hover:scale-110 group-hover:opacity-25 transition-all duration-700">
              <Orbit className="w-52 h-52 text-warm-cream" />
            </div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#7C9A86]/10 blur-3xl" />
            <div className="relative z-10 flex-1 flex flex-col justify-end">
              <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/15 transition-colors">
                <Compass className="text-warm-cream w-7 h-7" />
              </div>
              <h3 className="font-display text-3xl text-warm-cream mb-3">{t("home.bento.card1.title")}</h3>
              <p className="text-warm-cream/80 text-lg leading-relaxed max-w-md">
                {t("home.bento.card1.desc")}
              </p>
            </div>
          </motion.div>

          {/* Medium Card - Deep Interpretations */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-2 bg-gradient-to-br from-[#a67c7e] to-[#8C5A5C] rounded-3xl p-8 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-500 group"
          >
            <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/15 transition-colors">
              <BookOpen className="text-warm-cream w-6 h-6" />
            </div>
            <div>
              <h3 className="font-display text-2xl text-warm-cream mb-2">{t("home.bento.card2.title")}</h3>
              <p className="text-warm-cream/90 text-sm leading-relaxed">
                {t("home.bento.card2.desc")}
              </p>
            </div>
          </motion.div>

          {/* Small Card - Beautiful UX */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-[#8c7d75] to-[#6B615A] rounded-3xl p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-500 group"
          >
            <Star className="text-warm-cream w-7 h-7 mb-4 group-hover:rotate-12 transition-transform duration-500" />
            <div>
              <h3 className="font-display text-xl text-warm-cream mb-2">{t("home.bento.card3.title")}</h3>
              <p className="text-warm-cream/80 text-sm">{t("home.bento.card3.desc")}</p>
            </div>
          </motion.div>

          {/* Small Card - Cosmic Map */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-1 bg-gradient-to-br from-[#1a1320] to-mystic-dark border border-white/10 rounded-3xl p-7 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-shadow duration-500 group"
          >
            <Map className="text-dusty-rose w-7 h-7 mb-4 group-hover:scale-110 transition-transform duration-500" />
            <div>
              <h3 className="font-display text-xl text-warm-cream mb-2">{t("home.bento.card4.title")}</h3>
              <p className="text-slate-400 text-sm">{t("home.bento.card4.desc")}</p>
            </div>
          </motion.div>

          {/* Long CTA Card */}
          <motion.div
            variants={item}
            className="md:col-span-3 lg:col-span-4 bg-[#FAF7F2] dark:bg-white/[0.03] border border-[#EBE4D8] dark:border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500"
          >
            <div className="relative z-10 max-w-xl mb-6 md:mb-0">
              <h3 className="font-display text-2xl md:text-3xl text-mystic-dark dark:text-warm-cream mb-3">
                {t("home.bento.card5.title")}
              </h3>
              <p className="text-[#7A6E65] dark:text-slate-300 leading-relaxed">
                {t("home.bento.card5.desc")}
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#5C4033] dark:text-warm-cream font-semibold group-hover:gap-3 transition-all">
              <span className="hidden sm:inline">{t("misc.explore")}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
            <Sparkles className="w-36 h-36 text-dusty-rose/15 absolute -right-6 -top-6 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
