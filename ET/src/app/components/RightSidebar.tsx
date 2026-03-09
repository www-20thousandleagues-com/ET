import { Send, TrendingUp, Newspaper, Activity, CheckCircle, AlertTriangle } from "lucide-react";
import { useMemo } from "react";
import { useLocaleStore } from "@/stores/locale";
import { useAppStore } from "@/stores/app";
import { toast } from "sonner";
import { HEALTH_THRESHOLD_MS, MAX_RECENT_ITEMS } from "@/lib/constants";

function timeSince(dateStr: string, t: ReturnType<typeof useLocaleStore.getState>["t"]): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t.time.justNow;
  if (mins < 60) return t.time.minutesAgo.replace("{n}", String(mins));
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t.time.hoursAgo.replace("{n}", String(hours));
  return t.time.daysAgo.replace("{n}", String(Math.floor(hours / 24)));
}

export function RightSidebar() {
  const t = useLocaleStore((s) => s.t);
  const sources = useAppStore((s) => s.sources);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const queryCountToday = useAppStore((s) => s.queryCountToday);
  const currentQuery = useAppStore((s) => s.currentQuery);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const closeAllPanels = useAppStore((s) => s.closeAllPanels);
  const lastIngestionTime = useAppStore((s) => s.lastIngestionTime);
  const totalArticleCount = useAppStore((s) => s.totalArticleCount);

  // Health: if last ingestion was more than 2 hours ago, status is degraded
  const isHealthy = useMemo(
    () => (lastIngestionTime ? Date.now() - new Date(lastIngestionTime).getTime() < HEALTH_THRESHOLD_MS : false),
    [lastIngestionTime],
  );

  const handleSendToAnalyst = () => {
    const analysis = currentQuery?.analysis;
    const queryText = currentQuery?.query_text ?? t.export.title;
    const body = analysis
      ? t.sidebar.emailBodyQuery
          .replace("{query}", queryText)
          .replace("{content}", analysis.content)
          .replace("{primary}", String(analysis.primary_source_count))
          .replace("{supporting}", String(analysis.supporting_source_count))
          .replace("{confidence}", String(analysis.confidence))
      : t.sidebar.emailBodyDefault
          .replace("{sourceCount}", String(sources.length))
          .replace("{articleCount}", String(totalArticleCount));
    const subject = encodeURIComponent(t.sidebar.emailSubject.replace("{query}", queryText));
    window.open(`mailto:?subject=${subject}&body=${encodeURIComponent(body)}`);
  };

  const handleQuery = (text: string) => {
    closeAllPanels();
    submitQuery(text);
  };

  // Top sources ranked by article count
  const topSources = sources
    .filter((s) => s.article_count > 0)
    .sort((a, b) => b.article_count - a.article_count)
    .slice(0, MAX_RECENT_ITEMS);

  // Latest articles
  const latestArticles = recentArticles.slice(0, MAX_RECENT_ITEMS);

  return (
    <aside className="w-full h-screen border-l border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col overflow-y-auto">
      <div className="p-6">
        {/* Send to Analyst CTA */}
        <button
          onClick={() => {
            handleSendToAnalyst();
            toast.success(t.sidebar.sendToAnalyst);
          }}
          className={`w-full px-4 py-3 rounded transition-colors flex items-center justify-center gap-2 mb-6 font-medium ${
            currentQuery?.analysis
              ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-hover)]"
              : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-600"
          }`}
          title={currentQuery?.analysis ? t.sidebar.sendToAnalyst : t.sidebar.emailBodyDefault.split("\n")[0]}
        >
          <Send className="size-4" />
          <span>{t.sidebar.sendToAnalyst}</span>
        </button>

        {/* System Health Monitor */}
        <div className="mb-8 p-4 rounded border-2 border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="size-4 text-stone-700 dark:text-stone-300" />
            <h3 className="text-sm font-bold text-black dark:text-white">{t.sidebar.systemHealth}</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 dark:text-stone-400">{t.sidebar.pipelineStatus}</span>
              <div className="flex items-center gap-1.5">
                {isHealthy ? (
                  <>
                    <CheckCircle className="size-3 text-green-600" />
                    <span className="text-xs font-bold text-green-600">{t.sidebar.healthy}</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="size-3 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">{t.sidebar.degraded}</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 dark:text-stone-400">{t.sidebar.lastIngestion}</span>
              <span className="text-xs font-bold text-black dark:text-white">
                {lastIngestionTime ? timeSince(lastIngestionTime, t) : t.sidebar.neverRun}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600 dark:text-stone-400">{t.sidebar.vectorCount}</span>
              <span className="text-xs font-bold text-black dark:text-white">{totalArticleCount.toLocaleString()}</span>
            </div>
          </div>
        </div>

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
                  onClick={() => handleQuery(article.title)}
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
                onClick={() => handleQuery(t.sidebar.latestNewsFrom.replace("{name}", source.name))}
                className="w-full text-left p-3 rounded border-2 border-stone-200 dark:border-stone-700 hover:border-black dark:hover:border-white transition-colors flex items-center justify-between bg-white dark:bg-stone-900"
              >
                <span className="text-sm text-stone-800 dark:text-stone-200">{source.name}</span>
                <span className="text-xs font-bold text-[var(--brand)]">{source.article_count}</span>
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
              <span className="text-sm font-bold text-black dark:text-white">{totalArticleCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
