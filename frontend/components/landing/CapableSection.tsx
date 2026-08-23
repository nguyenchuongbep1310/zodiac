"use client";

import { motion, Variants } from "framer-motion";
import { Layers, Sparkles as SparklesIcon, Orbit, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function CapableSection() {
  const { t } = useTranslation();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
  };

  const cards = [
    {
      icon: SparklesIcon,
      title: t("home.capable.card1.title"),
      desc: t("home.capable.card1.desc"),
      accent: "from-[#a67c7e] to-[#8C5A5C]",
    },
    {
      icon: Layers,
      title: t("home.capable.card2.title"),
      desc: t("home.capable.card2.desc"),
      accent: "from-[#6B615A] to-[#8c7d75]",
    },
    {
      icon: Orbit,
      title: t("home.capable.card3.title"),
      desc: t("home.capable.card3.desc"),
      accent: "from-violet-600 to-violet-400",
    },
    {
      icon: SlidersHorizontal,
      title: t("home.capable.card4.title"),
      desc: t("home.capable.card4.desc"),
      accent: "from-[#2d4a4e] to-[#1a3538]",
    },
  ];

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-gradient-radial from-amber-500/5 to-transparent blur-3xl" />
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
            {t("home.capable.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t("home.capable.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.title}
              variants={item}
              className={`group relative rounded-3xl p-7 bg-gradient-to-br ${card.accent} shadow-xl hover:shadow-2xl transition-shadow duration-500 min-h-[220px] flex flex-col justify-between overflow-hidden`}
            >
              <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/15 transition-colors">
                <card.icon className="text-warm-cream w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-xl text-warm-cream mb-2">{card.title}</h3>
                <p className="text-warm-cream/85 text-sm leading-relaxed">{card.desc}</p>
              </div>
              <SparklesIcon className="w-24 h-24 text-white/10 absolute -right-4 -bottom-4 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
