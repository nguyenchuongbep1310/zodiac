"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useTranslation } from "@/lib/hooks/useI18n";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage } = useTranslation();

  // Handle scroll detection for subtle styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.synastry"), href: "/synastry" },
    { label: t("nav.astrology"), href: "#astrology" },
    { label: t("nav.faq"), href: "#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-4 inset-x-0 mx-auto z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled
            ? "w-[92%] md:w-[82%] max-w-6xl"
            : "w-[96%] md:w-[92%] max-w-7xl"
        }`}
      >
        <div
          className={`flex items-center justify-between px-8 py-4 sm:py-4.5 rounded-full border shadow-xl transition-colors duration-500 ${
            isScrolled
              ? "bg-white/15 dark:bg-black/30 border-white/20 dark:border-white/10 backdrop-blur-xl shadow-mystic-dark/10"
              : "bg-white/10 dark:bg-black/15 border-white/15 dark:border-white/5 backdrop-blur-md shadow-transparent"
          }`}
        >
          {/* Logo */}
          <BrandLogo size="md" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10 lg:gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 hover:text-mystic-dark dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* 2-Option Language Switcher Pill */}
            <div className="flex items-center bg-black/5 dark:bg-white/10 p-1 rounded-full border border-black/5 dark:border-white/10 text-sm font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  language === "en"
                    ? "bg-[#4A3525] text-[#F7F3ED] shadow-sm font-semibold"
                    : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  language === "vi"
                    ? "bg-[#4A3525] text-[#F7F3ED] shadow-sm font-semibold"
                    : "text-slate-700 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                Tiếng Việt
              </button>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-800 dark:text-slate-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-slate-800 dark:text-slate-200"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-mystic-dark/40 backdrop-blur-sm md:hidden flex justify-end"
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-3/4 max-w-sm h-full bg-warm-cream dark:bg-mystic-dark border-l border-white/10 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex justify-between items-center mb-12">
                <BrandLogo size="md" />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                >
                  <X size={24} className="text-slate-800 dark:text-slate-200" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 mb-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-slate-800 dark:text-slate-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-center bg-black/5 dark:bg-white/5 p-1 rounded-xl font-medium text-sm gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      language === "en"
                        ? "bg-[#4A3525] text-white shadow-sm font-semibold"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("vi")}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      language === "vi"
                        ? "bg-[#4A3525] text-white shadow-sm font-semibold"
                        : "text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    Tiếng Việt
                  </button>
                </div>

                <button
                  onClick={() => {
                    setTheme(theme === "dark" ? "light" : "dark");
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 font-medium"
                >
                  {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                  Toggle Theme
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
