import { Newspaper } from "lucide-react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { Skeleton } from "@/app/components/ui/skeleton";

export function SourceStrip() {
  const sources = useAppStore((s) => s.sources);
  const loading = useAppStore((s) => s.sourcesLoading);
  const t = useLocaleStore((s) => s.t);

  return (
    <div className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
          <Newspaper className="size-4" />
          <span>{t.sourceStrip.activeSources}</span>
        </div>
        <div className="flex items-center gap-4 flex-1">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded" />
            ))
          ) : sources.length > 0 ? (
            sources.filter((s) => s.article_count > 0).map((source) => (
              <button
                key={source.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
              >
                <span className="text-sm font-medium">{source.name}</span>
                <span className="text-xs opacity-70">{source.article_count}</span>
              </button>
            ))
          ) : (
            <span className="text-xs text-stone-500">{t.common.noSourcesConfigured}</span>
          )}
        </div>
        <button className="text-xs text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors">
          {t.common.configure}
        </button>
      </div>
    </div>
  );
}
