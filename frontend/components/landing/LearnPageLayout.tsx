"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { LearnArticleCard } from "./LearnArticleCard";
import { LearnCategoryFilter, type LearnCategory } from "./LearnCategoryFilter";
import { useTranslation } from "@/lib/hooks/useI18n";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "basics" | "intermediate" | "advanced" | "techniques";
  readTime: string;
  image?: string;
  href: string;
  featured?: boolean;
}

interface LearnPageLayoutProps {
  articles: Article[];
  title?: string;
  subtitle?: string;
  description?: string;
}

export function LearnPageLayout({
  articles,
  title,
  subtitle,
  description,
}: LearnPageLayoutProps) {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<LearnCategory>("all");

  const pageTitle = title || t("home.learn.title");
  const pageSubtitle = subtitle || t("home.learn.page_subtitle");
  const pageDesc = description || t("home.learn.page_desc");

  // Filter articles by category
  const filteredArticles = useMemo(() => {
    if (activeCategory === "all") {
      return articles;
    }
    return articles.filter((article) => article.category === activeCategory);
  }, [articles, activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="bg-[var(--am-surface)]">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}

        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-brand-dark dark:text-brand-light mb-4"
          >
            {pageTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-xl md:text-2xl text-brand-burgundy dark:text-brand-gold font-display font-bold tracking-tight mb-6"
          >
            {pageSubtitle}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1 from-brand-burgundy to-brand-gold mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-brand-dark/70 dark:text-brand-light/70 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {pageDesc}
          </motion.p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Category Filter */}
          <LearnCategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {/* Articles Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center mb-8"
          >
            <p className="text-brand-dark/60 dark:text-brand-light/60">
              {filteredArticles.length === 1
                ? t("home.learn.articles_found_single")
                : t("home.learn.articles_found").replace("{count}", filteredArticles.length.toString())}
            </p>
          </motion.div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            >
              {filteredArticles.map((article) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <LearnArticleCard {...article} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16"
            >
              <p className="text-lg text-brand-dark/60 dark:text-brand-light/60 mb-4">
                {t("home.learn.empty_category")}
              </p>
              <p className="text-sm text-brand-dark/40 dark:text-brand-light/40">
                {t("home.learn.empty_soon")}
              </p>
            </motion.div>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 md:mt-28 max-w-2xl mx-auto from-brand-burgundy/10 to-brand-teal/10 dark:from-brand-burgundy/20 dark:to-brand-teal/20 rounded-[var(--am-radius)] p-8 md:p-12 text-center border border-brand-burgundy/20 dark:border-brand-gold/20"
          >
            <h3 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight text-brand-dark dark:text-brand-light mb-3">
              {t("home.learn.newsletter_title")}
            </h3>
            <p className="text-brand-dark/70 dark:text-brand-light/70 mb-6">
              {t("home.learn.newsletter_desc")}
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder={t("home.learn.newsletter_placeholder")}
                className="flex-1 px-4 py-3 rounded-[var(--am-radius)] bg-[var(--am-field)] border border-brand-gray-light/50 dark:border-brand-burgundy-darker/30 text-brand-dark dark:text-brand-light placeholder-brand-dark/40 dark:placeholder-brand-light/40 focus:outline-none focus:border-brand-burgundy dark:focus:border-brand-gold transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-[var(--am-radius)] font-semibold text-white bg-brand-burgundy hover:bg-brand-burgundy-dark dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-brand-gold/90 transition-all duration-300 shadow-[var(--am-shadow)] hover:shadow-[var(--am-shadow)] whitespace-nowrap"
              >
                {t("home.learn.newsletter_btn")}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LearnPageLayout;
