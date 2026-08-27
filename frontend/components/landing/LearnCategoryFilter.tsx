"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "@/lib/hooks/useI18n";

export type LearnCategory = "all" | "basics" | "intermediate" | "advanced" | "techniques";

interface LearnCategoryFilterProps {
  onCategoryChange?: (category: LearnCategory) => void;
  activeCategory?: LearnCategory;
}

export function LearnCategoryFilter({
  onCategoryChange,
  activeCategory = "all",
}: LearnCategoryFilterProps) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LearnCategory>(activeCategory);

  const categories: Array<{
    value: LearnCategory;
    label: string;
    description: string;
    color: string;
  }> = [
    {
      value: "all",
      label: t("category.all"),
      description: t("category.all_desc"),
      color: "bg-asknova-dark dark:bg-asknova-light",
    },
    {
      value: "basics",
      label: t("category.basics"),
      description: t("category.basics_desc"),
      color: "bg-asknova-burgundy dark:bg-asknova-gold",
    },
    {
      value: "intermediate",
      label: t("category.intermediate"),
      description: t("category.intermediate_desc"),
      color: "bg-asknova-blue dark:bg-asknova-blue/70",
    },
    {
      value: "advanced",
      label: t("category.advanced"),
      description: t("category.advanced_desc"),
      color: "bg-asknova-teal dark:bg-asknova-teal/70",
    },
    {
      value: "techniques",
      label: t("category.techniques"),
      description: t("category.techniques_desc"),
      color: "bg-asknova-gold dark:bg-asknova-gold/70",
    },
  ];

  const handleSelect = (category: LearnCategory) => {
    setSelected(category);
    onCategoryChange?.(category);
  };

  return (
    <div className="flex flex-col gap-4 mb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-center md:justify-start"
      >
        {categories.map((category, index) => (
          <motion.button
            key={category.value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(category.value)}
            className={`
              relative px-6 py-3 rounded-lg font-semibold text-sm md:text-base
              transition-all duration-300
              ${
                selected === category.value
                  ? `text-white dark:text-asknova-dark ${category.color} shadow-lg`
                  : "bg-asknova-gray-light/30 dark:bg-asknova-burgundy-darker/30 text-asknova-dark dark:text-asknova-light hover:bg-asknova-gray-light/50 dark:hover:bg-asknova-burgundy-darker/50"
              }
            `}
          >
            <span className="block">{category.label}</span>
            <span className="text-xs opacity-75">{category.description}</span>

            {selected === category.value && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 rounded-lg border-2 border-current"
                transition={{ type: "spring", stiffness: 200, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Category Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-center text-sm text-asknova-dark/60 dark:text-asknova-light/60"
      >
        {selected === "all" && t("category.all_info")}
        {selected === "basics" && t("category.basics_info")}
        {selected === "intermediate" && t("category.intermediate_info")}
        {selected === "advanced" && t("category.advanced_info")}
        {selected === "techniques" && t("category.techniques_info")}
      </motion.div>
    </div>
  );
}

export default LearnCategoryFilter;
