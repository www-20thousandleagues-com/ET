import { SlidersHorizontal, EyeOff, LayoutList } from "lucide-react";

interface TriageFilterBarProps {
  confidenceThreshold: number;
  setConfidenceThreshold: (val: number) => void;
  isCompactMode: boolean;
  setIsCompactMode: (val: boolean) => void;
}

export function TriageFilterBar({ 
  confidenceThreshold, 
  setConfidenceThreshold, 
  isCompactMode, 
  setIsCompactMode 
}: TriageFilterBarProps) {
  return (
    <div className="bg-stone-50 dark:bg-[#0a0a0b] border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 shadow-sm py-2 px-4 flex items-center justify-between flex-wrap gap-4">
      
      {/* Confidence Slider */}
      <div className="flex items-center gap-3">
        <div className="text-[11px] font-bold uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
          <SlidersHorizontal className="size-3.5" /> Minimum Confidence
        </div>
        
        <div className="flex items-center gap-2">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={confidenceThreshold}
            onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
            className="w-32 h-1 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-stone-900 dark:text-stone-100 min-w-[32px] text-center">
            {confidenceThreshold}%
          </div>
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-4">
        {/* Triage View / Compact Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors flex items-center gap-1">
            <LayoutList className="size-3" /> Force Compact
          </span>
          <div className="relative">
             <input 
               type="checkbox" 
               className="sr-only" 
               checked={isCompactMode}
               onChange={(e) => setIsCompactMode(e.target.checked)}
             />
             <div className={`block w-8 h-4 rounded-full transition-colors ${isCompactMode ? 'bg-primary/50' : 'bg-stone-200 dark:bg-stone-800 group-hover:bg-stone-300 dark:group-hover:bg-stone-700'}`}></div>
             <div className={`dot absolute left-1 top-1 w-2 h-2 rounded-full transition-transform transform ${isCompactMode ? 'translate-x-4 bg-primary' : 'bg-white dark:bg-stone-400'}`}></div>
          </div>
        </label>
        
        <button className="text-[10px] font-bold uppercase tracking-widest text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 transition-colors">
          <EyeOff className="size-3" /> Hide Read
        </button>
      </div>

    </div>
  );
}
