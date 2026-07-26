"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ question, answer, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className="border-b border-slate-200 dark:border-white/10 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left focus:outline-none group"
      >
        <span className="font-display text-xl text-mystic-dark dark:text-warm-cream group-hover:text-dusty-rose transition-colors">
          {question}
        </span>
        <span className="ml-6 flex-shrink-0 text-slate-400 group-hover:text-dusty-rose transition-colors">
          {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-slate-600 dark:text-slate-400 leading-relaxed font-light">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const faqs = [
  {
    question: "How accurate is the chart calculation?",
    answer: "We use the Swiss Ephemeris, the gold standard in astrological calculations, ensuring micro-degree accuracy for all planetary positions, house cusps, and aspects based on your exact birth time and location.",
  },
  {
    question: "Do you use AI for interpretations?",
    answer: "Yes. While our astronomical data is strictly mathematical, we employ advanced AI models trained on vast libraries of psychological astrology texts to synthesize unique, deeply personalized interpretations that go far beyond generic cookbook astrology.",
  },
  {
    question: "Can I save charts for my friends and family?",
    answer: "Absolutely. Once you create an account, you can store an unlimited number of profiles in your cosmic rolodex, allowing you to instantly pull up their charts or check compatibility.",
  },
  {
    question: "Is this suitable for astrology beginners?",
    answer: "Yes! While we provide the depth that professional astrologers crave, our beautiful UI and clear, jargon-free explanations make it easy for anyone to discover the profound insights hidden in their cosmic blueprint.",
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-mystic-dark dark:text-warm-cream mb-4">
            Curious <span className="italic text-teal-muted">Minds</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Everything you need to know about our approach to modern astrology.
          </p>
        </div>

        <div className="bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-3xl p-6 md:p-10 shadow-xl shadow-mystic-dark/5">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
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
