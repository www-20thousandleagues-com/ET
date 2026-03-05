import { Search, BookmarkCheck, Database, ChevronRight, LogOut, Newspaper } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { useAuthStore } from "@/stores/auth";
import { useLocaleStore } from "@/stores/locale";
import { useAppStore } from "@/stores/app";

export function LeftNav() {
  const { profile, signOut } = useAuthStore();
  const t = useLocaleStore((s) => s.t);
  const recentQueries = useAppStore((s) => s.recentQueries);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const submitQuery = useAppStore((s) => s.submitQuery);

  const savedQueryItems = recentQueries.length > 0
    ? recentQueries.slice(0, 5).map((q) => q.query_text)
    : [];

  const recentArticleItems = recentArticles.length > 0
    ? recentArticles.slice(0, 5).map((a) => a.title.length > 40 ? a.title.substring(0, 40) + "..." : a.title)
    : [];

  const navSections = [
    ...(recentArticleItems.length > 0 ? [{
      title: t.nav.dailyScan,
      icon: Newspaper,
      items: recentArticleItems,
    }] : []),
    ...(savedQueryItems.length > 0 ? [{
      title: t.nav.savedQueries,
      icon: BookmarkCheck,
      items: savedQueryItems,
      onItemClick: (item: string) => submitQuery(item),
    }] : []),
    {
      title: t.nav.sources,
      icon: Database,
      items: [t.nav.allSources],
    },
  ];

  return (
    <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col h-screen">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800">
        <div className="mb-4">
          <ImageWithFallback
            src="https://images.squarespace-cdn.com/content/v1/6556194e9cc0e30b3030a441/78761e90-5e4a-4a8b-9224-6fdb54cde2c9/Et_Prim%E2%94%9C%C2%AAr_Vertikalt_Logo_Sort_R%E2%94%9C%E2%95%95d_RGB.png?format=1500w"
            alt="Et Primaer Logo"
            className="h-16 w-auto object-contain object-left dark:invert"
          />
        </div>
        <h1 className="font-bold text-black dark:text-white tracking-tight">Jaegeren</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">{t.nav.subtitle}</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {navSections.map((section) => (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-2 px-2 mb-2 text-stone-900 dark:text-stone-100">
              <section.icon className="size-4" />
              <h2 className="text-sm font-medium">{section.title}</h2>
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item}>
                  <button
                    onClick={() => "onItemClick" in section && (section as { onItemClick: (s: string) => void }).onItemClick(item)}
                    className="w-full text-left px-2 py-1.5 text-sm text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800 rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{item}</span>
                    <ChevronRight className="size-3 text-stone-400 dark:text-stone-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-stone-200 dark:border-stone-800">
        {profile && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-stone-700 dark:text-stone-300 truncate">
              {profile.full_name || profile.email}
            </span>
            <button
              onClick={signOut}
              className="p-1 text-stone-500 hover:text-black dark:hover:text-white transition-colors"
              title={t.common.logOut}
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 mb-2">
          <span>Jaegeren</span>
          <button className="text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white transition-colors">
            {t.common.settings}
          </button>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-stone-500">{t.common.theme}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-stone-500">{t.common.language}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
