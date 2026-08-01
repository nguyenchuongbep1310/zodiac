"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useTranslation } from "@/lib/hooks/useI18n";

interface FaqItemProps {
  question: string;
  answer: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
}

function FaqItem({ question, answer, isOpen, onToggle, index }: FaqItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="border-b border-[#E8DDD0] dark:border-white/8 last:border-0"
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-7 text-left focus:outline-none group"
      >
        <span className="font-display text-xl sm:text-2xl text-[#4A3525] dark:text-[#E8DDD3] group-hover:text-[#8C5A3C] dark:group-hover:text-[#E8B896] transition-colors pr-4">
          {question}
        </span>
        <span className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-300 ${
          isOpen 
            ? "bg-[#5C4033] border-[#5C4033] text-[#F7F3ED] rotate-0" 
            : "bg-transparent border-[#D0C4B8] dark:border-white/15 text-[#8C7A6B] dark:text-[#A8988C] group-hover:border-[#8C5A3C] group-hover:text-[#8C5A3C]"
        }`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-7 text-[#7A6E65] dark:text-[#A8988C] leading-relaxed font-light space-y-2 text-base sm:text-lg pl-1">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useTranslation();

  const planetKeys = [
    "home.faq.p1",
    "home.faq.p2",
    "home.faq.p3",
    "home.faq.p4",
    "home.faq.p5",
    "home.faq.p6",
    "home.faq.p7",
    "home.faq.p8",
    "home.faq.p9",
    "home.faq.p10",
  ];

  const faqs = [
    {
      question: t("home.faq.q1"),
      answer: <p>{t("home.faq.a1")}</p>,
    },
    {
      question: t("home.faq.q2"),
      answer: <p>{t("home.faq.a2")}</p>,
    },
    {
      question: t("home.faq.q5"),
      answer: (
        <div className="space-y-3 pt-1">
          <p className="font-medium text-[#4A3525] dark:text-[#E8DDD3] mb-3">
            {t("home.faq.a5_intro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
            {planetKeys.map((key, i) => (
              <div key={i} className="p-3 rounded-xl bg-[#F3EDE4] dark:bg-white/[0.04] border border-[#E8DDD0] dark:border-white/8 text-[#5C4033] dark:text-[#E8DDD3] font-medium hover:bg-[#EDE5D8] dark:hover:bg-white/[0.06] transition-colors">
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      question: t("home.faq.q3"),
      answer: <p>{t("home.faq.a3")}</p>,
    },
    {
      question: t("home.faq.q4"),
      answer: <p>{t("home.faq.a4")}</p>,
    },
  ];

  return (
    <section id="faq" className="py-28 px-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-gradient-radial from-[#B5A499]/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-3"
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#4A3525] dark:text-[#E8DDD3] tracking-tight">
            {t("home.faq.title")}
          </h2>
          <p className="text-[#7A6E65] dark:text-[#A8988C] text-lg sm:text-xl">
            {t("home.faq.subtitle")}
          </p>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#B5A499] to-transparent mx-auto mt-4" />
        </motion.div>

        <div className="bg-[#FAF7F2]/60 dark:bg-white/[0.02] backdrop-blur-xl border border-[#EBE4D8] dark:border-white/5 rounded-[2rem] p-7 sm:p-10 md:p-12 shadow-xl shadow-[#4A3525]/5 dark:shadow-black/20">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
