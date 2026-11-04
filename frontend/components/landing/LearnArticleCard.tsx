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
  const { t, localeHref } = useTranslation();

  const categoryColors: Record<string, string> = {
    basics: "bg-[var(--am-lilac)] text-[var(--am-ink)]",
    intermediate: "bg-[var(--am-mint)] text-[var(--am-ink)]",
    advanced: "bg-[var(--am-peach)] text-[var(--am-ink)]",
    techniques: "bg-[var(--am-gold)] text-[#1c1410]",
  };

  const categoryColor = categoryColors[category] || "bg-[var(--am-field)] text-[var(--am-ink)]";

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
      className="h-full"
    >
      <Link href={localeHref(href)}>
        <div
          className={`
            group relative flex h-full cursor-pointer flex-col overflow-hidden
            border-2 border-[var(--am-edge)] bg-[var(--am-surface)] shadow-[var(--am-shadow)]
            transition-[transform,box-shadow] duration-150
            hover:shadow-[6px_6px_0_var(--am-edge)] hover:[transform:translate(-2px,-2px)]
            ${featured ? "lg:col-span-2" : ""}
          `}
        >
          {/* Image Section */}
          {image && (
            <div className="relative h-48 overflow-hidden border-b-2 border-[var(--am-edge)] bg-[var(--am-lilac)]">
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
                    mono-label border-2 border-[var(--am-edge)] px-2 py-0.5 font-bold
                    ${categoryColor}
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
                font-display leading-tight mb-3 text-[var(--am-ink)]
                ${featured ? "text-lg md:text-xl" : "text-base md:text-lg"}
                group-hover:text-[var(--am-primary)]
                transition-colors
              `}
            >
              {title}
            </h3>

            {/* Excerpt */}
            <p
              className={`
                text-[var(--am-muted)]
                leading-relaxed mb-4 flex-grow
                ${featured ? "text-sm md:text-base" : "text-sm"}
              `}
            >
              {excerpt}
            </p>

            {/* Footer: Category & Read Time */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-[var(--am-edge)]">
              {!image && (
                <span
                  className={`
                    mono-label border-2 border-[var(--am-edge)] px-2 py-0.5 font-bold
                    ${categoryColor}
                  `}
                >
                  {categoryLabel}
                </span>
              )}

              <span className="mono-label text-[var(--am-muted)]">
                {readLabel}
              </span>
            </div>
          </div>

          {/* Arrow Indicator */}
          <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-[var(--am-primary)]"
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
