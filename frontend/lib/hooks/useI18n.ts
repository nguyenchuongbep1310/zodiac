"use client";

import { createContext, createElement, useCallback, useContext, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en, vi } from "../i18n/dictionaries";
import { defaultLocale, localePath, type Locale } from "../i18n/locale";

type Language = Locale;

interface I18nState {
  /** Last language the visitor picked; used to send returning visitors on "/" to their language. */
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: defaultLocale,
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "zodiac-i18n",
    }
  )
);

const LocaleContext = createContext<Language>(defaultLocale);

/**
 * Supplies the locale from the URL segment to client components. The URL is
 * the source of truth so the server renders the right language and every
 * language has its own indexable address.
 */
export function LocaleProvider({ locale, children }: { locale: Language; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const preferred = useI18nStore.getState().language;
    // Only the bare homepage follows a stored preference; deep links and
    // shared URLs always open in the language they name.
    if (pathname === "/" && locale === defaultLocale && preferred !== defaultLocale) {
      router.replace(localePath(preferred, "/"));
      return;
    }
    useI18nStore.getState().setLanguage(locale);
  }, [locale, pathname, router]);

  return createElement(LocaleContext.Provider, { value: locale }, children);
}

export function useTranslation() {
  const language = useContext(LocaleContext);
  const router = useRouter();
  const pathname = usePathname();
  const dict = language === "vi" ? vi : en;

  const t = (key: string): string => {
    return dict[key] || key;
  };

  const setLanguage = useCallback(
    (lang: Language) => {
      useI18nStore.getState().setLanguage(lang);
      const hash = typeof window !== "undefined" ? window.location.hash : "";
      router.push(localePath(lang, `${pathname}${hash}`));
    },
    [router, pathname]
  );

  /** Public URL of an internal path in the current language. */
  const localeHref = useCallback((path: string) => localePath(language, path), [language]);

  return { t, language, setLanguage, localeHref };
}
