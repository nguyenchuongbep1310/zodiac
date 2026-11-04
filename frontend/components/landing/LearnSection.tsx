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
  const { t, localeHref } = useTranslation();

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
    <section id="learn" className="w-full border-y-2 border-[var(--am-edge)] bg-[var(--am-surface)] py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h2 className="font-display text-4xl text-[var(--am-ink)] md:text-5xl">
              {sectionTitle}
            </h2>
            <p className="mt-3 text-lg text-[var(--am-muted)]">{sectionSubtitle}</p>
          </div>
          <a href={localeHref("/learn")} className="mono-label shrink-0 font-bold text-[var(--am-primary)] underline decoration-2 underline-offset-4">
            {t("home.learn.explore_all")} →
          </a>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {displayArticles.map((article) => (
            <motion.div key={article.id} variants={itemVariants}>
              <LearnArticleCard {...article} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default LearnSection;
