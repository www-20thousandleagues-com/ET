import { Link } from "react-router-dom";
import { TriageData } from "@/app/data/mockTriageData";
import { Bookmark } from "lucide-react";

export function TriageCard({ 
  data, 
  forceCompact = false,
  isBookmarked = false,
  onToggleBookmark
}: { 
  data: TriageData, 
  forceCompact?: boolean,
  isBookmarked?: boolean,
  onToggleBookmark?: (id: string, e: React.MouseEvent) => void
}) {
  // Determine Tier dynamically if not forcing compact list mode
  let tier = 2; // Default Standard
  if (data.metrics.confidence >= 85) tier = 1; // High Confidence / Hero
  if (data.metrics.confidence < 50) tier = 3;  // Low Confidence / Compact

  // Override to ultra-compressed if toggle is active
  if (forceCompact) tier = 3;

  // Render Tier 3 (Ultra-Compressed List Row)
  if (tier === 3) {
    return (
      <Link to={`/analysis/${data.id}`} className="group flex items-center gap-3 py-1.5 px-3 hover:bg-stone-50 dark:hover:bg-stone-900 border-b border-stone-200 dark:border-stone-800 last:border-0 transition-colors">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${data.metrics.urgency === 'critical' || data.metrics.urgency === 'high' ? 'bg-[#E94E3D]' : 'bg-stone-300 dark:bg-stone-700'}`} />
        <span className="text-[10px] font-mono text-stone-500 shrink-0 w-8">{data.metrics.confidence}%</span>
        
        <button 
          onClick={(e) => onToggleBookmark?.(data.id, e)}
          className={`shrink-0 p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors ${isBookmarked ? 'text-amber-500' : 'text-stone-400 dark:text-stone-600'}`}
        >
          <Bookmark className="size-3" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
        <h4 className="text-xs font-medium text-stone-800 dark:text-stone-300 truncate flex-1 group-hover:text-primary transition-colors">
          {data.headline}
        </h4>
        <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-600 shrink-0 hidden sm:block">
          {data.sector}
        </span>
        <span className="text-[10px] text-stone-500 font-mono shrink-0 w-12 text-right">
          {data.timestamp}
        </span>
      </Link>
    );
  }

  // Render Tier 1 & Tier 2
  const isTier1 = tier === 1;

  return (
    <Link 
      to={`/analysis/${data.id}`} 
      className={`group flex flex-col bg-white dark:bg-[#0a0a0b] border ${isTier1 ? 'border-l-2 border-l-[#E94E3D] border-y-stone-200 border-r-stone-200 dark:border-y-stone-800 dark:border-r-stone-800' : 'border-stone-200 dark:border-stone-800'} hover:border-stone-400 dark:hover:border-stone-600 transition-colors overflow-hidden ${isTier1 ? 'md:col-span-2 lg:col-span-2' : ''}`}
    >
      <div className={`flex flex-1 ${isTier1 ? 'p-4 gap-4 flex-col sm:flex-row' : 'p-3 flex-col gap-2'}`}>
        
        {/* Detail Column */}
        <div className="flex-1 flex flex-col">
          {/* Metadata Row */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isTier1 ? 'text-[#E94E3D]' : 'text-stone-500 dark:text-stone-400'}`}>
                {data.sector}
              </span>
              <span className="text-[10px] font-mono font-medium text-stone-400 dark:text-stone-600 bg-stone-100 dark:bg-stone-900 px-1 py-0.5 rounded">
                {data.metrics.confidence}% CONF
              </span>
              {isTier1 && (
                <span className="text-[9px] uppercase font-bold text-stone-400 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-1 py-0.5 rounded">
                  Tier 1
                </span>
              )}
            </div>
            
            <button 
              onClick={(e) => onToggleBookmark?.(data.id, e)}
              className={`shrink-0 p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${isBookmarked ? 'text-amber-500' : 'text-stone-400 dark:text-stone-600'}`}
            >
              <Bookmark className="size-4" fill={isBookmarked ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Headline & Summary */}
          <h3 className={`${isTier1 ? 'text-lg md:text-xl font-bold mb-2' : 'text-sm font-semibold mb-1'} text-stone-900 dark:text-stone-100 leading-snug group-hover:text-primary transition-colors`}>
            {data.headline}
          </h3>
          
          {data.tldr && (
            <p className={`${isTier1 ? 'text-sm leading-relaxed mb-3 line-clamp-3' : 'text-xs leading-tight mb-2 line-clamp-2'} text-stone-600 dark:text-stone-400`}>
              {data.tldr}
            </p>
          )}

          {/* Entity Tags & Footer (Pushed to bottom)*/}
          <div className="mt-auto pt-2 flex items-center justify-between flex-wrap gap-2">
            <div className="flex flex-wrap gap-1">
              {data.entities.slice(0, isTier1 ? 5 : 3).map((entity: string) => (
                <span key={entity} className="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors bg-stone-50 dark:bg-stone-900/50 px-1.5 py-0.5 rounded border border-transparent hover:border-stone-200 dark:hover:border-stone-700">
                  #{entity}
                </span>
              ))}
            </div>
            
            <div className="text-[10px] font-mono text-stone-400 flex items-center gap-2">
              <span title="Sources Synthesized">{data.metrics.sourceCount} SRC</span>
              <span>•</span>
              <span>{data.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Micro-Thumbnail (Tier 1 only, restrained size) */}
        {isTier1 && data.imageUrl && (
          <div className="shrink-0 sm:w-32 lg:w-48 h-24 sm:h-auto rounded border border-stone-200 dark:border-stone-800 overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-300">
             <img src={data.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
          </div>
        )}
      </div>
    </Link>
  );
}
