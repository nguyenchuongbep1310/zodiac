"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useTranslation } from "@/lib/hooks/useI18n";

export function FloatingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { t, language, setLanguage, localeHref } = useTranslation();

  // Hydration guard for next-themes: `theme` is undefined on the server and
  // on the very first client render, so rendering an icon based on it before
  // mounting causes a flash of the wrong icon (and can trigger a hydration
  // mismatch). This mirrors the same guard used in components/theme-toggle.tsx.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Handle scroll detection for subtle styling changes.
  // Throttled via rAF + a boundary-crossing check so we only trigger a
  // re-render when isScrolled actually flips, not on every scroll pixel.
  useEffect(() => {
    // Compute the initial state immediately in case the page loads already
    // scrolled (e.g. browser scroll restoration, or landing on a #hash),
    // instead of waiting for the first scroll event to fire.
    // One-time read of the real DOM scroll position on mount, not a data sync.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsScrolled(window.scrollY > 20);

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled((prev) => {
          const next = window.scrollY > 20;
          return prev === next ? prev : next;
        });
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open, and let Escape close it.
  //
  // `overflow: hidden` on body does NOT stop background scrolling on iOS
  // Safari — touchmove still scrolls/rubber-bands the page behind the
  // drawer. Pinning the body with `position: fixed` (and restoring the
  // scroll position on close) is the reliable cross-browser fix.
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const scrollY = window.scrollY;
    const body = document.body.style;
    const previous = { position: body.position, top: body.top, left: body.left, right: body.right, width: body.width };

    body.position = "fixed";
    body.top = `-${scrollY}px`;
    body.left = "0";
    body.right = "0";
    body.width = "100%";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      body.position = previous.position;
      body.top = previous.top;
      body.left = previous.left;
      body.right = previous.right;
      body.width = previous.width;
      window.scrollTo(0, scrollY);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Absolute hrefs (leading "/") so these still work when the navbar is
  // rendered on a route other than the homepage — a plain "#features" href
  // only scrolls within the current page and silently does nothing on
  // /learn, /synastry, /charts/[id], etc., since those sections only exist
  // on "/".
  const navLinks = [
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.synastry"), href: "/synastry" },
    { label: t("nav.astrology"), href: "/#astrology" },
    { label: t("nav.faq"), href: "/#faq" },
  ];

  const themeIcon = mounted ? (
    theme === "dark" ? <Sun size={22} /> : <Moon size={22} />
  ) : (
    <span className="block w-[22px] h-[22px]" aria-hidden="true" />
  );

  const themeIconMobile = mounted ? (
    theme === "dark" ? <Sun size={18} /> : <Moon size={18} />
  ) : (
    <span className="block w-[18px] h-[18px]" aria-hidden="true" />
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 mx-auto z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          "w-[calc(100%-1.5rem)] md:w-[calc(100%-3rem)] max-w-7xl"
        }`}
        style={{ top: "max(1rem, calc(env(safe-area-inset-top) + 0.5rem))" }}
      >
        <div
          className={`flex items-center justify-between px-5 md:px-8 py-2.5 md:py-3 rounded-full bg-[var(--am-surface)]/80 backdrop-blur-md border border-[var(--am-line)] transition-shadow duration-500 ${
            isScrolled ? "shadow-md shadow-black/5" : "shadow-none"
          }`}
        >
          {/* Logo */}
          <BrandLogo size="sm" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={localeHref(link.href)}
                className="text-sm lg:text-base font-semibold text-[var(--am-muted)] hover:text-[var(--am-primary)] dark:hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* 2-Option Language Switcher Pill */}
            <div className="flex items-center bg-[var(--am-lilac)]/50 p-0.5 rounded-full text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
                className={`px-3 py-1 rounded-full transition-all ${
                  language === "en"
                    ? "bg-[var(--am-primary)] text-[var(--am-primary-ink)] shadow-sm"
                    : "text-[var(--am-ink)]/70 hover:text-[var(--am-ink)]"
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage("vi")}
                aria-pressed={language === "vi"}
                className={`px-3 py-1 rounded-full transition-all ${
                  language === "vi"
                    ? "bg-[var(--am-primary)] text-[var(--am-primary-ink)] shadow-sm"
                    : "text-[var(--am-ink)]/70 hover:text-[var(--am-ink)]"
                }`}
              >
                Tiếng Việt
              </button>
            </div>

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-[var(--am-lilac)]/50 transition-colors text-[var(--am-primary)] dark:text-[var(--am-ink)]"
              aria-label="Toggle theme"
            >
              {themeIcon}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden -mr-2.5 p-2.5 text-[var(--am-ink)]"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileMenuOpen}
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
            className="fixed inset-0 z-[60] bg-[#17132e]/40 backdrop-blur-sm md:hidden flex justify-end"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-3/4 max-w-sm h-full bg-[var(--am-surface)] border-l border-[var(--am-line)] p-6 flex flex-col shadow-2xl"
              style={{
                paddingTop: "max(1.5rem, calc(env(safe-area-inset-top) + 1rem))",
                paddingBottom: "max(1.5rem, calc(env(safe-area-inset-bottom) + 1rem))",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-12">
                <BrandLogo size="md" onClick={() => setMobileMenuOpen(false)} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="-mr-2.5 p-2.5 rounded-full hover:bg-[var(--am-field)]"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-[var(--am-ink)]" />
                </button>
              </div>

              <nav className="flex flex-col gap-6 mb-12">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={localeHref(link.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-[var(--am-ink)]"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4">
                {/* Mobile Language Switcher */}
                <div className="flex items-center justify-center bg-[var(--am-field)] p-1 rounded-2xl font-medium text-sm gap-2">
                  <button
                    onClick={() => setLanguage("en")}
                    aria-pressed={language === "en"}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      language === "en"
                        ? "bg-[var(--am-ink)] text-white shadow-sm font-semibold"
                        : "text-[var(--am-muted)]"
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage("vi")}
                    aria-pressed={language === "vi"}
                    className={`flex-1 py-2 rounded-lg transition-all ${
                      language === "vi"
                        ? "bg-[var(--am-ink)] text-white shadow-sm font-semibold"
                        : "text-[var(--am-muted)]"
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
                  className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-[var(--am-field)] text-[var(--am-ink)] font-medium"
                >
                  {themeIconMobile}
                  <span>{t("nav.toggle_theme")}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
