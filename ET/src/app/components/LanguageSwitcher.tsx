import { useLocaleStore, type Locale } from "@/stores/locale";

const flags: Record<Locale, string> = {
  en: "EN",
  da: "DA",
};

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocaleStore();

  const toggle = () => {
    setLocale(locale === "en" ? "da" : "en");
  };

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium border border-stone-300 dark:border-stone-600 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-stone-700 dark:text-stone-300"
      title={locale === "en" ? "Switch to Danish" : "Skift til engelsk"}
    >
      <span className="font-bold">{flags[locale]}</span>
      <span className="text-stone-400">|</span>
      <span className="text-stone-400">{flags[locale === "en" ? "da" : "en"]}</span>
    </button>
  );
}
