import { Bookmark, ArrowLeft, Search, Trash2 } from "lucide-react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { safeFormatDate } from "@/lib/utils";
import { useSavedQueries } from "@/hooks/useQueries";

export function SavedQueriesView({ onClose }: { onClose: () => void }) {
  const recentQueries = useAppStore((s) => s.recentQueries);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const toggleSaveQuery = useAppStore((s) => s.toggleSaveQuery);
  const t = useLocaleStore((s) => s.t);

  // Use dedicated saved queries fetch (covers all saved, not just recent window)
  const { data: savedQueriesData } = useSavedQueries();

  // Merge: use full query objects from recentQueries where available, fall back to saved data
  const savedQueries = (savedQueriesData ?? []).map((sq) => {
    const full = recentQueries.find((q) => q.id === sq.id);
    return full ?? { ...sq, user_id: "", analysis: null, webResults: [] };
  });

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-accent transition-colors"
            aria-label={t.answer.goBack}
          >
            <ArrowLeft className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Bookmark className="size-5 text-[var(--brand)]" />
            <h2 className="text-lg font-bold text-foreground">{t.nav.savedQueries}</h2>
          </div>
          <span className="text-sm text-muted-foreground">({savedQueries.length})</span>
        </div>

        {savedQueries.length > 0 ? (
          <div className="space-y-2">
            {savedQueries.map((query) => (
              <div
                key={query.id}
                className="p-4 border-2 border-border rounded hover:border-foreground transition-colors bg-card group"
              >
                <div className="flex items-start justify-between gap-4">
                  <button
                    onClick={() => {
                      onClose();
                      submitQuery(query.query_text);
                    }}
                    className="flex-1 min-w-0 text-left"
                  >
                    <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-[var(--brand)] transition-colors">
                      {query.query_text}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{safeFormatDate(query.created_at)}</span>
                      {query.analysis && (
                        <>
                          <span>&bull;</span>
                          <span>
                            {query.analysis.confidence}% {t.answer.confidence.toLowerCase()}
                          </span>
                          <span>&bull;</span>
                          <span>
                            {query.analysis.citations.length} {t.answer.citationsAndSources.toLowerCase()}
                          </span>
                        </>
                      )}
                    </div>
                  </button>
                  <button
                    onClick={() => toggleSaveQuery(query.id)}
                    className="flex-shrink-0 p-2 text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title={t.common.unsave}
                    aria-label={t.common.unsave}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t.nav.noSavedQueries}</p>
          </div>
        )}
      </div>
    </div>
  );
}
