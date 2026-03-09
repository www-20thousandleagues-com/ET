import { ExternalLink, Globe } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import type { WebResult } from "@/types/database";
import type { Translations } from "@/lib/i18n/en";

export interface WebSearchResultsProps {
  results: WebResult[];
  t: Translations;
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function WebSearchResults({ results, t }: WebSearchResultsProps) {
  if (results.length === 0) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="size-4 text-brand" />
        <h3 className="text-sm font-bold text-foreground">{t.answer.liveWebResults}</h3>
        <span className="text-xs text-muted-foreground">({results.length})</span>
      </div>
      <div className="space-y-3">
        {results.map((r, i) => (
          <a
            key={`${r.url}-${i}`}
            href={isSafeUrl(r.url) ? r.url : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 sm:p-4 border-2 border-border rounded hover:border-brand transition-colors group bg-card"
          >
            <div className="flex items-start justify-between gap-2 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                    {t.answer.web}
                  </span>
                  {r.published_date && (
                    <span className="text-xs text-muted-foreground">{safeFormatDate(r.published_date)}</span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
                  {r.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">{r.content}</p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
