import { BookmarkCheck, Database, ChevronRight, LogOut, Newspaper } from "lucide-react";
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
  const sources = useAppStore((s) => s.sources);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const browseSource = useAppStore((s) => s.browseSource);

  const savedQueryItems = recentQueries.slice(0, 5);
  const recentArticleItems = recentArticles.slice(0, 5);
  const activeSources = sources.filter((s) => s.article_count > 0);

  return (
    <aside className="w-64 border-r border-stone-200 dark:border-stone-800 bg-background flex flex-col h-screen">
      <div className="p-6 border-b border-stone-200 dark:border-stone-800">
        <div className="mb-4">
          <ImageWithFallback
            src="https://images.squarespace-cdn.com/content/v1/6556194e9cc0e30b3030a441/78761e90-5e4a-4a8b-9224-6fdb54cde2c9/Et_Prim%E2%94%9C%C2%AAr_Vertikalt_Logo_Sort_R%E2%94%9C%E2%95%95d_RGB.png?format=1500w"
            alt="Et Primaer Logo"
            className="h-16 w-auto object-contain object-left dark:invert"
          />
        </div>
        <h1 className="font-bold text-foreground tracking-tight">Jaegeren</h1>
        <p className="text-xs text-muted-foreground mt-1">{t.nav.subtitle}</p>
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
                    onClick={() => submitQuery(article.title)}
                    className="w-full text-left px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded flex items-center justify-between group transition-colors"
                  >
                    <span className="truncate">
                      {article.title.length > 40 ? article.title.substring(0, 40) + "..." : article.title}
                    </span>
                    <ChevronRight className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Saved Queries */}
        {savedQueryItems.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 px-2 mb-2 text-foreground">
              <BookmarkCheck className="size-4" />
              <h2 className="text-sm font-medium">{t.nav.savedQueries}</h2>
            </div>
            <ul className="space-y-1">
              {savedQueryItems.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => submitQuery(q.query_text)}
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
                    onClick={() => browseSource(source)}
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
        {profile && (
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground truncate">
              {profile.full_name || profile.email}
            </span>
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
