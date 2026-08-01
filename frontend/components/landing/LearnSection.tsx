"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/hooks/useI18n";

interface ArticleCardProps {
  artwork: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

function ArticleCard({ artwork, title, description, className = "" }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`group cursor-pointer transition-transform duration-300 hover:-translate-y-2 ${className}`}
    >
      <div className="relative w-full rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-[#E8DDD0] dark:border-white/10 transition-all duration-500 group-hover:scale-[1.02]">
        {artwork}
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A3525]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#4A3525] dark:text-[#E8DDD3] mt-5 leading-snug tracking-tight group-hover:text-[#8C5A3C] dark:group-hover:text-[#E8B896] transition-colors">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-[#7A6E65] dark:text-[#A8988C] font-light mt-2 line-clamp-3 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}

export function LearnSection() {
  const { t } = useTranslation();

  return (
    <section className="w-full bg-[#F7F3ED] dark:bg-[#14110F] py-24 sm:py-28 px-6 sm:px-12 lg:px-16 transition-colors border-t border-[#E8DDD0]/50 dark:border-white/5 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#B5A499]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative">
        {/* Header Alignment */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-end text-right space-y-2"
        >
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#4A3525] dark:text-[#E8DDD3] font-normal tracking-tight">
            {t("home.learn.title")}
          </h2>
          <p className="font-serif text-2xl sm:text-3xl text-[#947E70] dark:text-[#A8988C] font-light italic">
            {t("home.learn.subtitle")}
          </p>
          <div className="w-24 h-0.5 bg-gradient-to-l from-[#B5A499] to-transparent mt-2" />
        </motion.div>

        {/* 3-Column Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Card 1: Sun Conjunct Venus (Portrait 4/5) */}
          <div className="md:col-span-4 lg:col-span-4">
            <ArticleCard
              artwork={
                <div className="w-full aspect-[4/5] bg-[#EADFD4] relative overflow-hidden">
                  <img
                    src="/images/learn_sun_venus.png"
                    alt="Sun Conjunct Venus"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              }
              title={t("home.learn.card1.title")}
              description={t("home.learn.card1.desc")}
            />
          </div>

          {/* Card 2: Venus Conjunct Mars (Vertical 3/5) */}
          <div className="md:col-span-3 lg:col-span-3">
            <ArticleCard
              artwork={
                <div className="w-full aspect-[3/5] bg-[#DFD5C6] relative overflow-hidden">
                  <img
                    src="/images/learn_venus_mars.png"
                    alt="Venus Conjunct Mars"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              }
              title={t("home.learn.card2.title")}
              description={t("home.learn.card2.desc")}
            />
          </div>

          {/* Card 3: Moon Conjunct Mars (Wide Hero 16/9) */}
          <div className="md:col-span-5 lg:col-span-5">
            <ArticleCard
              artwork={
                <div className="w-full aspect-[16/9] bg-[#E3D7C7] relative overflow-hidden">
                  <img
                    src="/images/learn_moon_mars.png"
                    alt="Moon Conjunct Mars"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              }
              title={t("home.learn.card3.title")}
              description={t("home.learn.card3.desc")}
            />
          </div>

        </div>
      </div>
    </section>
  );
}
