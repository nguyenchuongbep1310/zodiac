"use client";

import { motion } from "framer-motion";
import { LearnArticleCard } from "./LearnArticleCard";
import { useTranslation } from "@/lib/hooks/useI18n";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "basics" | "intermediate" | "advanced" | "techniques";
  readTime: string;
  image?: string;
  href: string;
  featured?: boolean;
}

interface LearnSectionProps {
  articles?: Article[];
  title?: string;
  subtitle?: string;
}

export function LearnSection({
  articles,
  title,
  subtitle,
}: LearnSectionProps) {
  const { t } = useTranslation();

  const sectionTitle = title || t("home.learn.title");
  const sectionSubtitle = subtitle || t("home.learn.subtitle");

  const defaultArticles: Article[] = [
    {
      id: "1",
      title: t("home.learn.card1.title"),
      excerpt: t("home.learn.card1.desc"),
      category: "basics",
      readTime: t("home.learn.card1.readTime"),
      image: "/learn/birth-chart.jpg",
      href: "/learn/birth-chart/sun-moon",
      featured: true,
    },
    {
      id: "2",
      title: t("home.learn.card2.title"),
      excerpt: t("home.learn.card2.desc"),
      category: "basics",
      readTime: t("home.learn.card2.readTime"),
      image: "/learn/mercury-retrograde.jpg",
      href: "/learn/birth-chart/planets",
    },
    {
      id: "3",
      title: t("home.learn.card3.title"),
      excerpt: t("home.learn.card3.desc"),
      category: "intermediate",
      readTime: t("home.learn.card3.readTime"),
      image: "/learn/aspect-patterns.jpg",
      href: "/learn/techniques/aspects",
    },
    {
      id: "4",
      title: t("home.learn.card4.title"),
      excerpt: t("home.learn.card4.desc"),
      category: "intermediate",
      readTime: t("home.learn.card4.readTime"),
      image: "/learn/house-systems.jpg",
      href: "/learn/synastry/basics",
    },
    {
      id: "5",
      title: t("home.learn.card5.title"),
      excerpt: t("home.learn.card5.desc"),
      category: "advanced",
      readTime: t("home.learn.card5.readTime"),
      image: "/learn/transits.jpg",
      href: "/learn/techniques/transits",
    },
    {
      id: "6",
      title: t("home.learn.card6.title"),
      excerpt: t("home.learn.card6.desc"),
      category: "advanced",
      readTime: t("home.learn.card6.readTime"),
      image: "/learn/synastry.jpg",
      href: "/learn/synastry/venus-mars",
    },
  ];

  const displayArticles = articles || defaultArticles;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <section className="relative py-20 md:py-28 px-4 md:px-6 lg:px-8 bg-white dark:bg-asknova-bg-dark overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-asknova-burgundy/5 dark:bg-asknova-burgundy/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-asknova-teal/5 dark:bg-asknova-teal/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-display italic font-bold text-asknova-dark dark:text-asknova-light mb-4"
          >
            {sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-asknova-burgundy dark:text-asknova-gold font-display italic"
          >
            {sectionSubtitle}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="w-20 h-1 bg-gradient-to-r from-asknova-burgundy to-asknova-gold mx-auto mt-6"
          />
        </motion.div>

        {/* Articles Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {displayArticles.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <LearnArticleCard {...article} />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 md:mt-20"
        >
          <p className="text-asknova-dark/70 dark:text-asknova-light/70 mb-6">
            {t("home.learn.want_deeper")}
          </p>
          <motion.a
            href="/learn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-8 py-3 rounded-lg font-semibold text-white bg-asknova-burgundy hover:bg-asknova-burgundy-dark dark:bg-asknova-gold dark:text-asknova-dark dark:hover:bg-asknova-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {t("home.learn.explore_all")}
            <span className="ml-2">→</span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

export default LearnSection;
