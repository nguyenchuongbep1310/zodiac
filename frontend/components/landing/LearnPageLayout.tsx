"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { LearnArticleCard } from "./LearnArticleCard";
import { LearnCategoryFilter, type LearnCategory } from "./LearnCategoryFilter";

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
  title = "Learn Astrology",
  subtitle = "Comprehensive Guides & Tutorials",
  description = "Everything you need to understand astrology, from beginner basics to advanced techniques. Our carefully curated articles are designed to demystify the cosmos and help you connect with the stars.",
}: LearnPageLayoutProps) {
  const [activeCategory, setActiveCategory] = useState<LearnCategory>("all");

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
    <div className="bg-white dark:bg-asknova-bg-dark">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-6 lg:px-8 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-asknova-burgundy/5 dark:bg-asknova-burgundy/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-asknova-teal/5 dark:bg-asknova-teal/10 rounded-full blur-3xl -z-10" />

        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl lg:text-7xl font-display italic font-bold text-asknova-dark dark:text-asknova-light mb-4"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-xl md:text-2xl text-asknova-burgundy dark:text-asknova-gold font-display italic mb-6"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="w-24 h-1 bg-gradient-to-r from-asknova-burgundy to-asknova-gold mx-auto mb-8"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-asknova-dark/70 dark:text-asknova-light/70 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            {description}
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
            <p className="text-asknova-dark/60 dark:text-asknova-light/60">
              {filteredArticles.length} article
              {filteredArticles.length !== 1 ? "s" : ""} found
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
              <p className="text-lg text-asknova-dark/60 dark:text-asknova-light/60 mb-4">
                No articles found in this category yet.
              </p>
              <p className="text-sm text-asknova-dark/40 dark:text-asknova-light/40">
                Check back soon for more content!
              </p>
            </motion.div>
          )}

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-20 md:mt-28 max-w-2xl mx-auto bg-gradient-to-r from-asknova-burgundy/10 to-asknova-teal/10 dark:from-asknova-burgundy/20 dark:to-asknova-teal/20 rounded-xl p-8 md:p-12 text-center border border-asknova-burgundy/20 dark:border-asknova-gold/20"
          >
            <h3 className="text-2xl md:text-3xl font-display italic font-bold text-asknova-dark dark:text-asknova-light mb-3">
              Get New Articles Weekly
            </h3>
            <p className="text-asknova-dark/70 dark:text-asknova-light/70 mb-6">
              Subscribe to our newsletter and never miss a new astrology guide.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-asknova-surface-dark border border-asknova-gray-light/50 dark:border-asknova-burgundy-darker/30 text-asknova-dark dark:text-asknova-light placeholder-asknova-dark/40 dark:placeholder-asknova-light/40 focus:outline-none focus:border-asknova-burgundy dark:focus:border-asknova-gold transition-colors"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-lg font-semibold text-white bg-asknova-burgundy hover:bg-asknova-burgundy-dark dark:bg-asknova-gold dark:text-asknova-dark dark:hover:bg-asknova-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LearnPageLayout;
