"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // Handle scroll detection for subtle styling changes
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Astrology", href: "#astrology" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <header
        className={`fixed top-4 inset-x-0 mx-auto z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          isScrolled
            ? "w-[90%] md:w-[70%] max-w-4xl"
            : "w-[95%] md:w-[85%] max-w-5xl"
        }`}
      >
        <div
          className={`flex items-center justify-between px-6 py-3 rounded-full border shadow-lg transition-colors duration-500 ${
            isScrolled
              ? "bg-white/10 dark:bg-black/20 border-white/20 dark:border-white/10 backdrop-blur-xl shadow-mystic-dark/10"
              : "bg-white/5 dark:bg-black/10 border-white/10 dark:border-white/5 backdrop-blur-md shadow-transparent"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-dusty-rose to-teal-muted p-1.5 rounded-full shadow-inner">
              <Sparkles className="w-4 h-4 text-warm-cream animate-pulse-glow" />
            </div>
            <span className="font-display font-semibold text-xl tracking-wide text-mystic-dark dark:text-warm-cream transition-colors group-hover:text-dusty-rose">
              Zodiac
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-mystic-dark dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button
              onClick={() => {
                if (pathname !== "/") {
                  window.location.href = "/";
                } else {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="relative overflow-hidden px-5 py-2 rounded-full bg-mystic-dark dark:bg-warm-cream text-warm-cream dark:text-mystic-dark text-sm font-medium shadow-md transition-transform hover:scale-105 active:scale-95 group"
            >
              <span className="relative z-10">Start Your Journey</span>
              <div className="absolute inset-0 bg-gradient-to-r from-teal-muted/40 to-dusty-rose/40 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                <span className="font-display font-semibold text-2xl text-mystic-dark dark:text-warm-cream">
                  Zodiac
                </span>
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
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (pathname !== "/") {
                      window.location.href = "/";
                    } else {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  className="flex justify-center items-center p-3 rounded-xl bg-mystic-dark dark:bg-warm-cream text-warm-cream dark:text-mystic-dark font-medium w-full"
                >
                  Start Your Journey
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
