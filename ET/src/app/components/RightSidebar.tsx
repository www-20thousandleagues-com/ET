import { Send, HelpCircle, TrendingUp, Newspaper } from "lucide-react";
import { useLocaleStore } from "@/stores/locale";
import { useAppStore } from "@/stores/app";

export function RightSidebar() {
  const t = useLocaleStore((s) => s.t);
  const sources = useAppStore((s) => s.sources);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const queryCountToday = useAppStore((s) => s.queryCountToday);
  const currentQuery = useAppStore((s) => s.currentQuery);
  const submitQuery = useAppStore((s) => s.submitQuery);

  const totalArticles = sources.reduce((sum, s) => sum + s.article_count, 0);

  // Derive trending from sources with most articles
  const trending = sources
    .filter((s) => s.article_count > 0)
    .sort((a, b) => b.article_count - a.article_count)
    .slice(0, 4)
    .map((s) => ({
      title: s.name,
      count: s.article_count,
    }));

  // Derive related questions from recent articles or current analysis
  const relatedQuestions = currentQuery?.analysis
    ? recentArticles
        .slice(0, 5)
        .map((a) => a.title)
    : recentArticles
        .slice(0, 5)
        .map((a) => a.title);

  return (
    <aside className="w-80 border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col h-screen overflow-y-auto">
      <div className="p-6">
        {/* Send to Analyst CTA */}
        <button className="w-full px-4 py-3 bg-[#E94E3D] text-white rounded hover:bg-[#d43d2d] transition-colors flex items-center justify-center gap-2 mb-6 font-medium">
          <Send className="size-4" />
          <span>{t.sidebar.sendToAnalyst}</span>
        </button>

        {/* Latest Articles */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">{t.sidebar.latestArticles}</h3>
          </div>
          <div className="space-y-2">
            {relatedQuestions.length > 0 ? (
              relatedQuestions.map((title, index) => (
                <button
                  key={index}
                  onClick={() => submitQuery(title)}
                  className="w-full text-left p-3 text-sm text-stone-800 dark:text-stone-200 border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white bg-white dark:bg-stone-900 rounded transition-colors"
                >
                  <span className="line-clamp-2">{title}</span>
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
            {trending.map((topic) => (
              <div
                key={topic.title}
                className="w-full text-left p-3 rounded border-2 border-stone-200 dark:border-stone-700 flex items-center justify-between bg-white dark:bg-stone-900"
              >
                <span className="text-sm text-stone-800 dark:text-stone-200">
                  {topic.title}
                </span>
                <span className="text-xs font-bold text-[#E94E3D]">{topic.count} articles</span>
              </div>
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
              <span className="text-sm font-bold text-black dark:text-white">{sources.length || "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-700 dark:text-stone-300">{t.sidebar.newArticles}</span>
              <span className="text-sm font-bold text-black dark:text-white">{totalArticles || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
