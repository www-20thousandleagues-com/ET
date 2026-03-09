import { Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";

export function SourceStrip() {
  const sources = useAppStore((s) => s.sources);
  const loading = useAppStore((s) => s.sourcesLoading);
  const selectedSource = useAppStore((s) => s.selectedSource);
  const browseSource = useAppStore((s) => s.browseSource);
  const showAllSources = useAppStore((s) => s.showAllSources);
  const toggleShowAllSources = useAppStore((s) => s.toggleShowAllSources);
  const t = useLocaleStore((s) => s.t);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displaySources = showAllSources ? sources : sources.filter((s) => s.article_count > 0);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-900/80 border-b border-stone-200 dark:border-stone-800 px-2 sm:px-4 py-2.5">
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 flex-shrink-0">
          <Newspaper className="size-3.5" />
          <span className="font-medium">{t.sourceStrip.activeSources}</span>
        </div>

        <button
          onClick={() => scroll("left")}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          aria-label={t.common.scrollLeft}
        >
          <ChevronLeft className="size-4" />
        </button>

        <div ref={scrollRef} className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-hide scroll-smooth">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-24 rounded bg-stone-200 dark:bg-stone-800 animate-pulse flex-shrink-0" />
            ))
          ) : displaySources.length > 0 ? (
            displaySources.map((source) => (
              <button
                key={source.id}
                onClick={() => browseSource(source)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all ${
                  selectedSource?.id === source.id
                    ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                    : "border-stone-300 dark:border-stone-600 hover:border-black dark:hover:border-white text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white"
                }`}
              >
                <span>{source.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  selectedSource?.id === source.id
                    ? "bg-white/20"
                    : "bg-stone-200 dark:bg-stone-700"
                }`}>
                  {source.article_count}
                </span>
              </button>
            ))
          ) : (
            <span className="text-xs text-stone-500">{t.common.noSourcesConfigured}</span>
          )}
        </div>

        <button
          onClick={() => scroll("right")}
          className="p-0.5 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
          aria-label={t.common.scrollRight}
        >
          <ChevronRight className="size-4" />
        </button>

        <button
          onClick={toggleShowAllSources}
          title={showAllSources ? t.common.showActiveSources : t.common.showAllSources}
          className={`text-xs px-3 py-1.5 rounded-full border transition-colors flex-shrink-0 ${
            showAllSources
              ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white"
              : "border-stone-300 dark:border-stone-600 text-stone-600 dark:text-stone-400 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white"
          }`}
        >
          <span className="hidden sm:inline">{showAllSources ? `${t.common.showActiveSources} (${displaySources.length})` : `${t.common.showAllSources} (${sources.length})`}</span>
          <span className="sm:hidden">{showAllSources ? displaySources.length : sources.length}</span>
        </button>
      </div>
    </div>
  );
}
