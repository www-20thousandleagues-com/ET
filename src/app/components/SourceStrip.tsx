import { Newspaper } from "lucide-react";

export function SourceStrip() {
  const sources = [
    { name: "Caixin", count: 142, active: true },
    { name: "Nikkei", count: 89, active: true },
    { name: "FT", count: 231, active: true },
    { name: "WSJ", count: 167, active: true },
  ];

  return (
    <div className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 px-6 py-3">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
          <Newspaper className="size-4" />
          <span>Aktive kilder</span>
        </div>
        <div className="flex items-center gap-4 flex-1">
          {sources.map((source) => (
            <button
              key={source.name}
              className="flex items-center gap-2 px-3 py-1.5 rounded border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
            >
              <span className="text-sm font-medium">{source.name}</span>
              <span className="text-xs opacity-70">{source.count}</span>
            </button>
          ))}
        </div>
        <button className="text-xs text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors">
          Konfigurer
        </button>
      </div>
    </div>
  );
}