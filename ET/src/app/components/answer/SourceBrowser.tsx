import { ExternalLink, ArrowLeft, Newspaper, SearchX } from "lucide-react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { Skeleton } from "@/app/components/ui/skeleton";
import { safeFormatDate } from "@/lib/utils";

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function SourceBrowser() {
  const selectedSource = useAppStore((s) => s.selectedSource);
  const sourceArticles = useAppStore((s) => s.sourceArticles);
  const sourceArticlesLoading = useAppStore((s) => s.sourceArticlesLoading);
  const clearSelectedSource = useAppStore((s) => s.clearSelectedSource);
  const t = useLocaleStore((s) => s.t);

  if (!selectedSource) return null;

  if (sourceArticlesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
        <div className="max-w-4xl space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={clearSelectedSource}
            className="p-1.5 rounded hover:bg-accent transition-colors"
            aria-label={t.answer.goBack}
          >
            <ArrowLeft className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Newspaper className="size-5 text-brand" />
            <h2 className="text-lg font-bold text-foreground">{selectedSource.name}</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {sourceArticles.length} {sourceArticles.length === 1 ? t.answer.article : t.answer.articles}
          </span>
        </div>

        {sourceArticles.length > 0 ? (
          <div className="space-y-2">
            {sourceArticles.map((article) => (
              <a
                key={article.id}
                href={isSafeUrl(article.url) ? article.url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-border rounded hover:border-brand transition-colors group bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.source_name}</span>
                      <span>&bull;</span>
                      <span>{safeFormatDate(article.published_at)}</span>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchX className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t.answer.noArticlesForSource}</p>
          </div>
        )}
      </div>
    </div>
  );
}
