import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en, vi } from "../i18n/dictionaries";

type Language = "en" | "vi";

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "zodiac-i18n",
    }
  )
);

export function useTranslation() {
  const language = useI18nStore((state) => state.language);
  const dict = language === "vi" ? vi : en;

  const t = (key: string): string => {
    return dict[key] || key;
  };

  return { t, language, setLanguage: useI18nStore.getState().setLanguage };
}
