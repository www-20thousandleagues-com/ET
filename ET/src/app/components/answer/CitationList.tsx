import { ExternalLink, Check, Filter, ArrowUpDown, X } from "lucide-react";
import { safeFormatDate } from "@/lib/utils";
import type { RagCitation } from "@/types/database";
import type { Translations } from "@/lib/i18n/en";

type SortOption = "date" | "relevance" | "source";
type ActiveMenu = "sort" | "filter" | null;

export interface CitationListSectionProps {
  citations: RagCitation[];
  allCitations: RagCitation[];
  sortBy: SortOption;
  setSortBy: (opt: SortOption) => void;
  filterSource: string;
  setFilterSource: (source: string) => void;
  sourceNames: string[];
  activeMenu: ActiveMenu;
  setActiveMenu: (menu: "export" | "sort" | "filter" | null) => void;
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

function CitationCard({ citation, sortBy, t }: { citation: RagCitation; sortBy: SortOption; t: Translations }) {
  return (
    <div className="p-3 sm:p-4 border-2 border-border rounded hover:border-muted-foreground transition-colors group bg-card">
      <div className="flex items-start justify-between gap-2 sm:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">[{citation.position}]</span>
            <span className="text-xs font-bold text-foreground bg-accent px-2 py-0.5 rounded">
              {citation.source_name}
            </span>
            <span className="text-xs text-muted-foreground">{safeFormatDate(citation.published_at)}</span>
            {sortBy === "relevance" && (
              <span className="text-xs text-muted-foreground">
                &bull; {citation.relevance_score}% {t.answer.match}
              </span>
            )}
          </div>
          <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
            {citation.title}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed hidden sm:block">{citation.excerpt}</p>
        </div>
        <a
          href={isSafeUrl(citation.url) ? citation.url : "#"}
          className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-accent rounded transition-all"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${t.common.openArticle}: ${citation.title}`}
        >
          <ExternalLink className="size-4 text-muted-foreground" />
        </a>
      </div>
    </div>
  );
}

export function CitationListSection({
  citations,
  sortBy,
  setSortBy,
  filterSource,
  setFilterSource,
  sourceNames,
  activeMenu,
  setActiveMenu,
  t,
}: CitationListSectionProps) {
  const sortLabels: Record<SortOption, string> = {
    relevance: t.answer.relevance,
    date: t.answer.date,
    source: t.answer.source,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-2">
        <h3 className="text-sm font-bold text-foreground">{t.answer.citationsAndSources}</h3>
        <div className="flex items-center gap-2">
          {/* Filter */}
          <div className="relative">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveMenu(activeMenu === "filter" ? null : "filter")}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
                aria-label={t.answer.filterBySource}
              >
                <Filter className="size-3.5" />
                <span className="hidden sm:inline">{filterSource === "all" ? t.common.allSources : filterSource}</span>
              </button>
              {filterSource !== "all" && (
                <button
                  onClick={() => setFilterSource("all")}
                  className="p-1 rounded hover:bg-accent transition-colors"
                  title={t.answer.clearFilter}
                  aria-label={t.answer.clearFilter}
                >
                  <X className="size-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            {activeMenu === "filter" && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                <div className="absolute right-0 top-full mt-1 w-48 bg-card border-2 border-foreground rounded shadow-lg z-20">
                  <div className="py-1">
                    {sourceNames.map((source) => (
                      <button
                        key={source}
                        onClick={() => {
                          setFilterSource(source);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between"
                      >
                        <span>{source === "all" ? t.answer.all : source}</span>
                        {filterSource === source && <Check className="size-3 text-foreground" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === "sort" ? null : "sort")}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 text-xs border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
              aria-label={t.answer.sortCitations}
            >
              <ArrowUpDown className="size-3.5" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
            </button>
            {activeMenu === "sort" && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                <div className="absolute right-0 top-full mt-1 w-32 bg-card border-2 border-foreground rounded shadow-lg z-20">
                  <div className="py-1">
                    {(["relevance", "date", "source"] as SortOption[]).map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSortBy(opt);
                          setActiveMenu(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between"
                      >
                        <span>{sortLabels[opt]}</span>
                        {sortBy === opt && <Check className="size-3 text-foreground" />}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {citations.map((citation) => (
          <CitationCard key={citation.id} citation={citation} sortBy={sortBy} t={t} />
        ))}
      </div>
    </div>
  );
}
