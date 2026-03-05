import { TrendingUp, Newspaper } from "lucide-react";
import { useLocaleStore } from "@/stores/locale";
import { useAppStore } from "@/stores/app";

export function RightSidebar() {
  const t = useLocaleStore((s) => s.t);
  const sources = useAppStore((s) => s.sources);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const queryCountToday = useAppStore((s) => s.queryCountToday);
  const submitQuery = useAppStore((s) => s.submitQuery);

  const totalArticles = sources.reduce((sum, s) => sum + s.article_count, 0);

  // Top sources ranked by article count
  const topSources = sources
    .filter((s) => s.article_count > 0)
    .sort((a, b) => b.article_count - a.article_count)
    .slice(0, 5);

  // Latest articles
  const latestArticles = recentArticles.slice(0, 5);

  return (
    <aside className="w-80 border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col h-screen overflow-y-auto">
      <div className="p-6">
        {/* Latest Articles */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">{t.sidebar.latestArticles}</h3>
          </div>
          <div className="space-y-2">
            {latestArticles.length > 0 ? (
              latestArticles.map((article) => (
                <button
                  key={article.id}
                  onClick={() => submitQuery(article.title)}
                  className="w-full text-left p-3 text-sm border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white bg-white dark:bg-stone-900 rounded transition-colors"
                >
                  <span className="line-clamp-2 text-stone-800 dark:text-stone-200">{article.title}</span>
                  <span className="block text-xs text-stone-500 mt-1">{article.source_name}</span>
                </button>
              ))
            ) : (
              <p className="text-xs text-stone-500">{t.common.loading}</p>
            )}
          </div>
        </div>

        {/* Top Sources */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">{t.sidebar.topSources}</h3>
          </div>
          <div className="space-y-2">
            {topSources.map((source) => (
              <button
                key={source.id}
                onClick={() => submitQuery(`Latest news from ${source.name}`)}
                className="w-full text-left p-3 rounded border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white transition-colors flex items-center justify-between bg-white dark:bg-stone-900"
              >
                <span className="text-sm text-stone-800 dark:text-stone-200">{source.name}</span>
                <span className="text-xs font-bold text-[#E94E3D]">{source.article_count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-stone-50 dark:bg-stone-950 rounded border-2 border-stone-200 dark:border-stone-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">{t.sidebar.queriesToday}</span>
              <span className="text-sm font-bold text-black dark:text-white">{queryCountToday}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">{t.sidebar.monitoredSources}</span>
              <span className="text-sm font-bold text-black dark:text-white">{sources.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">{t.sidebar.newArticles}</span>
              <span className="text-sm font-bold text-black dark:text-white">{totalArticles}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
