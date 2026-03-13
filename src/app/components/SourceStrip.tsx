import { Newspaper } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function SourceStrip() {
  const { t } = useTranslation();
  const sources = [
    { name: "Caixin", count: 142, active: true },
    { name: "Nikkei", count: 89, active: true },
    { name: "FT", count: 231, active: true },
    { name: "WSJ", count: 167, active: true },
  ];

  return (
    <div className="bg-[#0a0a0b] border-b border-[#1C1C1D] px-3 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-[#5F5F5F]">
          <Newspaper className="size-3.5 text-[#ef4444]" />
          <span>{t('feed.active_feeds')}</span>
        </div>
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar">
          {sources.map((source) => (
            <button
              key={source.name}
              className="flex items-center gap-2 px-2 py-1 rounded border border-[#1C1C1D] bg-[#111112] hover:bg-[#1C1C1D] transition-colors shrink-0"
            >
              <span className="text-[11px] font-bold text-stone-300">{source.name}</span>
              <span className="text-[10px] font-mono text-[#5F5F5F]">{source.count}</span>
            </button>
          ))}
        </div>
        <Link 
          to="/settings/profile" 
          className="flex items-center justify-center h-6 w-6 rounded border border-[#1C1C1D] bg-[#111112] hover:bg-[#1C1C1D] transition-all ml-2 group shrink-0"
          title="User Settings"
        >
          <span className="text-[10px] font-bold text-stone-400 group-hover:text-stone-200">SI</span>
        </Link>
      </div>
    </div>
  );
}