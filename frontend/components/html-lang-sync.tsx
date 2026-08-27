"use client";

import { useEffect } from "react";
import { useTranslation } from "@/lib/hooks/useI18n";

/**
 * Keeps <html lang="..."> in sync with the user's selected UI language.
 *
 * The language toggle is client-only state (zustand + localStorage), while
 * the <html> tag is emitted once by the server-rendered root layout as a
 * static "en". Without this, the documentElement's lang attribute never
 * reflects a switch to Vietnamese, which is wrong for screen readers,
 * translation tools, and search engines indexing the rendered page.
 */
export function HtmlLangSync() {
  const { language } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
