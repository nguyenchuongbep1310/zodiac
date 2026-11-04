"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      className="border-b-2 border-[var(--am-edge)]"
    >
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-display pr-4 text-base text-[var(--am-ink)] transition-colors group-hover:text-[var(--am-primary)] sm:text-lg">
          {question}
        </span>
        <span aria-hidden="true" className="font-display flex-shrink-0 text-2xl text-[var(--am-primary)]">
          {isOpen ? "−" : "+"}
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
            <div className="pb-5 text-[var(--am-muted)] leading-relaxed space-y-2 text-base">
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
          <p className="font-medium text-[var(--am-ink)] mb-3">
            {t("home.faq.a5_intro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
            {planetKeys.map((key, i) => (
              <div key={i} className="p-3 rounded-xl bg-[var(--am-field)] border border-[var(--am-line)] text-[var(--am-ink)] font-medium transition-colors">
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
    <section id="faq" className="w-full py-20 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <h2 className="font-display mb-3 text-4xl text-[var(--am-ink)] md:text-5xl">
              {t("home.faq.title")}
            </h2>
            <p className="text-[var(--am-muted)] text-lg">{t("home.faq.subtitle")}</p>
          </motion.div>

          <div className="border-t-2 border-[var(--am-edge)]">
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
      </div>
    </section>
  );
}
