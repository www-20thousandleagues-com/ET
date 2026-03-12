import { Activity, Database, AlertTriangle, Zap } from "lucide-react";

export function IngestionHUD() {
  return (
    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded mb-4 overflow-hidden shadow-sm flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-stone-200 dark:divide-stone-800">
      
      {/* Title / Status */}
      <div className="flex items-center gap-3 px-4 py-3 sm:w-64 shrink-0 bg-stone-50 dark:bg-stone-950/50">
        <div className="relative flex size-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full size-3 bg-primary"></span>
        </div>
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
            <Activity className="size-3.5" /> Hunter Engine
          </h2>
          <span className="text-[10px] text-stone-500 font-medium">Status: Active Ingestion</span>
        </div>
      </div>

      {/* Telemetry Metrics */}
      <div className="flex-1 grid grid-cols-3 divide-x divide-stone-200 dark:divide-stone-800">
        {/* Metric 1 */}
        <div className="px-4 py-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
            <Database className="size-3" /> Articles (24h)
          </span>
          <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100 leading-none">
            14,293
          </span>
        </div>
        
        {/* Metric 2 */}
        <div className="px-4 py-2 flex flex-col justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1.5">
            <Zap className="size-3 text-amber-500" /> Active Syntheses
          </span>
          <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100 leading-none">
            2,104
          </span>
        </div>

        {/* Metric 3 */}
        <div className="px-4 py-2 flex flex-col justify-center bg-red-500/5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1 flex items-center gap-1.5">
            <AlertTriangle className="size-3" /> Critical Anomalies
          </span>
          <span className="text-xl font-bold font-mono text-red-600 dark:text-red-500 leading-none flex items-center gap-2">
            7 <span className="text-xs text-red-500/70 font-sans tracking-tight">requires review</span>
          </span>
        </div>
      </div>

    </div>
  );
}
