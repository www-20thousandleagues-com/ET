import { Search, Sparkles, Command, Loader2 } from "lucide-react";
import { useState, useEffect, useRef, useMemo } from "react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";

export function QueryArea() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const queryLoading = useAppStore((s) => s.queryLoading);
  const recentArticles = useAppStore((s) => s.recentArticles);
  const t = useLocaleStore((s) => s.t);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed || queryLoading) return;
    submitQuery(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Derive quick queries from recent article titles (first 3 unique sources)
  const quickQueries = useMemo(() => {
    if (recentArticles.length === 0) return [];
    const seen = new Set<string>();
    const queries: string[] = [];
    for (const a of recentArticles) {
      if (!seen.has(a.source_name) && queries.length < 3) {
        seen.add(a.source_name);
        const short = a.title.length > 50 ? a.title.substring(0, 50) + "..." : a.title;
        queries.push(short);
      }
    }
    return queries;
  }, [recentArticles]);

  return (
    <div className="border-b border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 p-3 sm:p-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-stone-400 dark:text-stone-500" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.query.placeholder}
          className="w-full pl-12 pr-24 py-4 text-base border-2 border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-black dark:text-white placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded focus:outline-none focus:border-black dark:focus:border-white transition-colors"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <kbd className="hidden md:flex items-center gap-1 px-2 py-1 text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-200 dark:border-stone-700">
            <Command className="size-3" />
            <span>K</span>
          </kbd>
          <button
            onClick={handleSubmit}
            disabled={queryLoading || !query.trim()}
            className="p-2 bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors disabled:opacity-50"
          >
            {queryLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          </button>
        </div>
      </div>
      {quickQueries.length > 0 && (
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-stone-600 dark:text-stone-400">{t.query.quickQueries}</span>
          <div className="flex gap-2">
            {quickQueries.map((q) => (
              <button
                key={q}
                onClick={() => {
                  setQuery(q);
                  submitQuery(q);
                }}
                className="px-3 py-1 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
