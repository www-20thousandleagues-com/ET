import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";

export function SourceStrip() {
  const sources = [
    { name: "Caixin", count: 142, active: true },
    { name: "Nikkei", count: 89, active: true },
    { name: "FT", count: 231, active: true },
    { name: "WSJ", count: 167, active: true },
  ];

  return (
    <div className="bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 px-3 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-500">
          <Newspaper className="size-3.5 text-primary" />
          <span>Active Feeds</span>
        </div>
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          {sources.map((source) => (
            <button
              key={source.name}
              className="flex items-center gap-2 px-2 py-1 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-500 transition-colors shrink-0"
            >
              <span className="text-[11px] font-bold text-stone-700 dark:text-stone-300">{source.name}</span>
              <span className="text-[10px] font-mono text-stone-500">{source.count}</span>
            </button>
          ))}
        </div>
        <Link 
          to="/settings/profile" 
          className="flex items-center justify-center h-6 w-6 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all ml-2 group shrink-0"
          title="User Settings"
        >
          <span className="text-[10px] font-bold text-stone-600 dark:text-stone-400 group-hover:text-stone-900 dark:group-hover:text-stone-100">SI</span>
        </Link>
      </div>
    </div>
  );
}