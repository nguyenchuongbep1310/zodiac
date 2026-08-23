"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

export function ReadYourSkyCTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-28 px-6 overflow-hidden bg-mystic-dark">
      {/* Decorative glow / stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-violet-600/15 to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-radial from-amber-500/10 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2 className="font-display italic text-4xl md:text-6xl text-warm-cream mb-5 tracking-tight">
          {t("home.cta.title")}
        </h2>
        <p className="text-slate-300 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          {t("home.cta.subtitle")}
        </p>
        <Link
          href="#hero"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-mystic-dark font-semibold text-lg shadow-glow-amber hover:shadow-glow-lg hover:scale-[1.03] transition-all duration-300"
        >
          {t("home.cta.button")}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </motion.div>
    </section>
  );
}
