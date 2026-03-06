import { create } from "zustand";
import { persist } from "zustand/middleware";
import { en } from "@/lib/i18n/en";
import { da } from "@/lib/i18n/da";

export type Locale = "en" | "da";

const translations = { en, da } as const;

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof en;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => {
        document.documentElement.lang = locale;
        set({ locale, t: translations[locale] });
      },
      t: translations["en"],
    }),
    {
      name: "jaegeren-locale",
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.t = translations[state.locale];
          document.documentElement.lang = state.locale;
        }
      },
    }
  )
);
