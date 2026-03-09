import { Newspaper, ExternalLink, Eye, Clock, TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";
import { useLocaleStore } from "@/stores/locale";
import { safeFormatDate } from "@/lib/utils";

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function hoursAgo(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return Infinity;
  return (Date.now() - d.getTime()) / (1000 * 60 * 60);
}

type ArticleItem = {
  id: string;
  title: string;
  source_name: string;
  published_at: string;
  url: string;
};

function matchesLens(title: string, lensPrompt: string): boolean {
  // Simple keyword matching: check if any significant word from the lens prompt appears in the title
  const keywords = lensPrompt
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 3);
  const lowerTitle = title.toLowerCase();
  return keywords.some((kw) => lowerTitle.includes(kw));
}

export function OverviewDashboard() {
  const recentArticles = useAppStore((s) => s.recentArticles);
  const sources = useAppStore((s) => s.sources);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const browseSource = useAppStore((s) => s.browseSource);
  const lenses = useSettingsStore((s) => s.lenses);
  const topics = useSettingsStore((s) => s.topics);
  const t = useLocaleStore((s) => s.t);

  // Group articles by source
  const groupedBySource = useMemo(() => {
    const groups = new Map<string, ArticleItem[]>();
    for (const article of recentArticles) {
      const key = article.source_name || "Unknown";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(article);
    }
    return Array.from(groups.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [recentArticles]);

  // Articles from last 24h
  const last24h = useMemo(
    () => recentArticles.filter((a) => hoursAgo(a.published_at) <= 24),
    [recentArticles]
  );

  // Articles matching user topics
  const topicArticles = useMemo(() => {
    if (topics.length === 0) return [];
    return recentArticles.filter((a) => {
      const lower = a.title.toLowerCase();
      return topics.some((topic) => lower.includes(topic.toLowerCase()));
    });
  }, [recentArticles, topics]);

  // Map articles to matching lenses
  const lensMatches = useMemo(() => {
    if (lenses.length === 0) return new Map<string, string[]>();
    const map = new Map<string, string[]>();
    for (const article of recentArticles) {
      const matching = lenses.filter((l) => matchesLens(article.title, l.prompt)).map((l) => l.name);
      if (matching.length > 0) map.set(article.id, matching);
    }
    return map;
  }, [recentArticles, lenses]);

  if (recentArticles.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <Newspaper className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.overview.title}</h3>
          <p className="text-sm text-muted-foreground">{t.overview.noStoriesYet}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-1">{t.overview.title}</h2>
          <p className="text-sm text-muted-foreground">{t.overview.subtitle}</p>
        </div>

        {/* Topic-matched articles (personalized section) */}
        {topicArticles.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="size-4 text-[var(--brand)]" />
              <h3 className="text-sm font-bold text-foreground">{t.settings.topics}</h3>
              <span className="text-xs text-muted-foreground">({topicArticles.length})</span>
            </div>
            <div className="space-y-2">
              {topicArticles.slice(0, 5).map((article) => {
                const articleLenses = lensMatches.get(article.id) ?? [];
                return (
                  <button
                    key={article.id}
                    onClick={() => submitQuery(article.title)}
                    className="w-full text-left p-4 border-2 border-[var(--brand)]/30 rounded hover:border-[var(--brand)] transition-colors bg-card group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-[var(--brand)] transition-colors">
                          {article.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{article.source_name}</span>
                          <span>&bull;</span>
                          <span>{safeFormatDate(article.published_at)}</span>
                          {articleLenses.map((lens) => (
                            <span key={lens} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-bold">
                              <Eye className="size-2.5" />
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Last 24 hours overview */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="size-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold text-foreground">{t.overview.last24h}</h3>
            <span className="text-xs text-muted-foreground">({last24h.length} {t.answer.articles})</span>
          </div>
          <div className="space-y-2">
            {last24h.slice(0, 10).map((article) => {
              const articleLenses = lensMatches.get(article.id) ?? [];
              return (
                <button
                  key={article.id}
                  onClick={() => submitQuery(article.title)}
                  className="w-full text-left p-3 border-2 border-border rounded hover:border-foreground transition-colors bg-card group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-[var(--brand)] transition-colors">
                        {article.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{article.source_name}</span>
                        <span>&bull;</span>
                        <span>{safeFormatDate(article.published_at)}</span>
                        {articleLenses.map((lens) => (
                          <span key={lens} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-[10px] font-bold">
                            <Eye className="size-2.5" />
                            {lens}
                          </span>
                        ))}
                      </div>
                    </div>
                    {article.url && isSafeUrl(article.url) && (
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-accent rounded transition-all"
                      >
                        <ExternalLink className="size-3.5 text-muted-foreground" />
                      </a>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Stories grouped by source */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Newspaper className="size-4 text-[var(--brand)]" />
            <h3 className="text-sm font-bold text-foreground">{t.overview.storiesBySource}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {groupedBySource.map(([sourceName, articles]) => {
              const source = sources.find((s) => s.name === sourceName);
              return (
                <div key={sourceName} className="border-2 border-border rounded bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-foreground">{sourceName}</h4>
                    <span className="text-xs text-muted-foreground">{articles.length} {t.answer.articles}</span>
                  </div>
                  <ul className="space-y-1.5 mb-3">
                    {articles.slice(0, 3).map((article) => {
                      const articleLenses = lensMatches.get(article.id) ?? [];
                      return (
                        <li key={article.id}>
                          <button
                            onClick={() => submitQuery(article.title)}
                            className="w-full text-left text-xs text-muted-foreground hover:text-foreground transition-colors line-clamp-2"
                          >
                            {article.title}
                            {articleLenses.length > 0 && (
                              <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-[9px] font-bold align-middle">
                                <Eye className="size-2" />
                                {articleLenses[0]}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  {source && (
                    <button
                      onClick={() => browseSource(source)}
                      className="text-xs text-[var(--brand)] hover:underline"
                    >
                      {t.overview.viewAll} &rarr;
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
