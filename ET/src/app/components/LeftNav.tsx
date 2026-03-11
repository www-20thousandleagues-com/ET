import { BookmarkCheck, Database, ChevronRight, LogOut, Newspaper, Bookmark, Settings } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { LanguageSwitcher } from "@/app/components/LanguageSwitcher";
import { useAuthStore } from "@/stores/auth";
import { useLocaleStore } from "@/stores/locale";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";
import { useSavedQueries } from "@/hooks/useQueries";
import { MAX_TITLE_LENGTH, MAX_RECENT_ITEMS, MAX_RECENT_QUERIES_DISPLAY } from "@/lib/constants";

export function LeftNav() {
  const { profile, signOut } = useAuthStore();
  const t = useLocaleStore((s) => s.t);
  const recentQueries = useAppStore((s) => s.recentQueries);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const sources = useAppStore((s) => s.sources);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const browseSource = useAppStore((s) => s.browseSource);
  const closeAllPanels = useAppStore((s) => s.closeAllPanels);
  const goHome = useAppStore((s) => s.goHome);
  const setShowSavedQueries = useAppStore((s) => s.setShowSavedQueries);
  const openSettings = useSettingsStore((s) => s.openSettings);

  // Fetch saved queries directly from Supabase (not just filtering recent window)
  const { data: savedQueriesData } = useSavedQueries();
  const savedQueries = (savedQueriesData ?? []).slice(0, MAX_RECENT_QUERIES_DISPLAY);
  const recentQueryItems = recentQueries.slice(0, MAX_RECENT_QUERIES_DISPLAY);
  const recentArticleItems = recentArticles.slice(0, MAX_RECENT_ITEMS);
  const activeSources = sources.filter((s) => s.article_count > 0);

  const handleQueryClick = (text: string) => {
    closeAllPanels();
    submitQuery(text);
  };

  const handleSourceClick = (source: (typeof sources)[0]) => {
    closeAllPanels();
    browseSource(source);
  };

  return (
    <aside className="w-full h-full border-r border-stone-200 dark:border-stone-800 bg-background flex flex-col">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800">
        <button
          onClick={() => {
            closeAllPanels();
            goHome();
          }}
          className="w-full text-left group"
          title={t.common.home}
        >
          <div className="mb-4">
            <ImageWithFallback
              src="/logo.png"
              alt={t.common.logoAlt}
              className="h-16 w-auto object-contain object-left dark:invert group-hover:opacity-80 transition-opacity"
            />
          </div>
          <h1 className="font-bold text-foreground tracking-tight group-hover:text-[var(--brand)] transition-colors">
            Jaegeren
          </h1>
          <p className="text-xs text-muted-foreground mt-1">{t.nav.subtitle}</p>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {/* Daily Scan — recent articles */}
        {recentArticleItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 mb-2 text-foreground">
              <Newspaper className="size-4" />
              <h2 className="text-sm font-medium">{t.nav.dailyScan}</h2>
            </div>
            <ul className="space-y-1">
              {recentArticleItems.map((article) => (
                <li key={article.id}>
                  <button
                    onClick={() => handleQueryClick(article.title)}
                    className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">
                      {article.title.length > MAX_TITLE_LENGTH
                        ? article.title.substring(0, MAX_TITLE_LENGTH) + "..."
                        : article.title}
                    </span>
                    <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Saved Queries */}
        <div className="mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2 text-foreground">
              <Bookmark className="size-4" />
              <h2 className="text-sm font-medium">{t.nav.savedQueries}</h2>
            </div>
            <button
              onClick={() => {
                closeAllPanels();
                setShowSavedQueries(true);
              }}
              className="text-xs text-[var(--brand)] hover:underline"
            >
              {t.nav.viewAllSaved}
            </button>
          </div>
          <ul className="space-y-1">
            {savedQueries.length > 0 ? (
              savedQueries.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => handleQueryClick(q.query_text)}
                    className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{q.query_text}</span>
                    <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                </li>
              ))
            ) : (
              <li className="px-2 py-1.5 text-xs text-muted-foreground">{t.nav.noSavedQueries}</li>
            )}
          </ul>
        </div>

        {/* Recent Queries */}
        {recentQueryItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 mb-2 text-foreground">
              <BookmarkCheck className="size-4" />
              <h2 className="text-sm font-medium">{t.nav.queryHistory}</h2>
            </div>
            <ul className="space-y-1">
              {recentQueryItems.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => handleQueryClick(q.query_text)}
                    className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{q.query_text}</span>
                    <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources — real source list with article counts */}
        <div className="mb-6">
          <div className="flex items-center gap-2 px-2 mb-2 text-foreground">
            <Database className="size-4" />
            <h2 className="text-sm font-medium">{t.nav.sources}</h2>
          </div>
          <ul className="space-y-1">
            {activeSources.length > 0 ? (
              activeSources.map((source) => (
                <li key={source.id}>
                  <button
                    onClick={() => handleSourceClick(source)}
                    className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">{source.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{source.article_count}</span>
                  </button>
                </li>
              ))
            ) : (
              <li className="px-2 py-1.5 text-xs text-muted-foreground">{t.common.loading}</li>
            )}
          </ul>
        </div>
      </nav>

      <div className="p-4 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={() => {
            closeAllPanels();
            openSettings();
          }}
          className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors mb-3"
        >
          <Settings className="size-4" />
          <span>{t.nav.settings}</span>
        </button>
        {profile && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground truncate">{profile.full_name || profile.email}</span>
            <button
              onClick={signOut}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title={t.common.logOut}
              aria-label={t.common.logOut}
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        )}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{t.common.theme}</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">{t.common.language}</span>
          <LanguageSwitcher />
        </div>
      </div>
    </aside>
  );
}
