"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/lib/hooks/useI18n";

interface LearnArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image?: string;
  href: string;
  featured?: boolean;
}

export function LearnArticleCard({
  title,
  excerpt,
  category,
  readTime,
  image,
  href,
  featured = false,
}: LearnArticleCardProps) {
  const { t } = useTranslation();

  const categoryColors: Record<string, string> = {
    basics: "bg-asknova-burgundy/10 text-asknova-burgundy dark:bg-asknova-burgundy/20 dark:text-asknova-gold",
    intermediate:
      "bg-asknova-blue/10 text-asknova-blue dark:bg-asknova-blue/20 dark:text-asknova-light",
    advanced:
      "bg-asknova-teal/10 text-asknova-teal dark:bg-asknova-teal/20 dark:text-asknova-gold",
    techniques:
      "bg-asknova-gold/10 text-asknova-dark dark:bg-asknova-gold/20 dark:text-asknova-gold",
  };

  const categoryColor =
    categoryColors[category] ||
    "bg-asknova-gray-accent/10 text-asknova-dark dark:bg-asknova-gray-accent/20 dark:text-asknova-light";

  const categoryKey = `category.${category}`;
  const translatedCategory = t(categoryKey);
  const categoryLabel = translatedCategory !== categoryKey
    ? translatedCategory
    : category.charAt(0).toUpperCase() + category.slice(1);

  const readSuffix = t("home.learn.read_suffix");
  const readLabel = readTime.includes("phút") || readTime.includes("min")
    ? (readSuffix ? `${readTime} ${readSuffix}` : readTime)
    : `${readTime} ${readSuffix || "read"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={href}>
        <div
          className={`
            group relative h-full flex flex-col rounded-lg overflow-hidden
            bg-white dark:bg-asknova-surface-dark
            border border-asknova-gray-light/50 dark:border-asknova-burgundy-darker/30
            hover:border-asknova-burgundy dark:hover:border-asknova-gold
            shadow-sm hover:shadow-md
            transition-all duration-300 cursor-pointer
            ${featured ? "lg:col-span-2" : ""}
          `}
        >
          {/* Image Section */}
          {image && (
            <div className="relative h-48 overflow-hidden bg-gradient-to-br from-asknova-burgundy/20 to-asknova-blue/20 dark:from-asknova-burgundy/10 dark:to-asknova-blue/10">
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <Image
                  src={image}
                  alt={title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  loading="lazy"
                  className="object-cover"
                />
              </motion.div>

              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${categoryColor}
                    backdrop-blur-sm
                  `}
                >
                  {categoryLabel}
                </span>
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 flex flex-col p-5 md:p-6">
            {/* Title */}
            <h3
              className={`
                font-display italic font-bold leading-tight mb-3
                text-asknova-dark dark:text-asknova-light
                ${featured ? "text-lg md:text-xl" : "text-base md:text-lg"}
                hover:text-asknova-burgundy dark:hover:text-asknova-gold
                transition-colors
              `}
            >
              {title}
            </h3>

            {/* Excerpt */}
            <p
              className={`
                text-asknova-dark/70 dark:text-asknova-light/70
                leading-relaxed mb-4 flex-grow
                ${featured ? "text-sm md:text-base" : "text-sm"}
              `}
            >
              {excerpt}
            </p>

            {/* Footer: Category & Read Time */}
            <div className="flex items-center justify-between pt-4 border-t border-asknova-gray-light/30 dark:border-asknova-burgundy-darker/20">
              {!image && (
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${categoryColor}
                  `}
                >
                  {categoryLabel}
                </span>
              )}

              <span className="text-xs text-asknova-dark/60 dark:text-asknova-light/60 font-medium">
                {readLabel}
              </span>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-asknova-burgundy dark:text-asknova-gold"
            >
              →
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default LearnArticleCard;
