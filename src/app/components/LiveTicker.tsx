import { AlertCircle } from "lucide-react";

const TICKER_ITEMS = [
  "BREAKING: US Department of Commerce expands AI chip export controls to 14 additional entities in Middle East.",
  "LIVE: ECB President Lagarde hints at potential 50bps cut in June if core inflation breaks 2.5%.",
  "URGENT: Maersk suspends all Red Sea transits indefinitely following drone swarm attack on container vessel.",
  "UPDATE: TSMC confirms structural damage at Fab 14A after 6.2 earthquake; yield impact assessment underway."
];

export function LiveTicker() {
  return (
    <div className="bg-[#E94E3D] text-white overflow-hidden flex items-center h-8 shrink-0">
      <div className="bg-black/20 h-full flex items-center px-3 font-bold text-[10px] uppercase tracking-widest gap-1.5 shrink-0 z-10 border-r border-[#E94E3D]/50 shadow-[4px_0_8px_rgba(233,78,61,0.5)]">
        <AlertCircle className="size-3" />
        Live Ingestion
      </div>
      
      {/* Ticker Animation Container */}
      <div className="flex whitespace-nowrap overflow-hidden flex-1 relative">
        <div className="animate-[ticker_40s_linear_infinite] flex items-center gap-12 pl-4">
          {TICKER_ITEMS.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              <span className="text-[11px] font-medium tracking-wide">{item}</span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {TICKER_ITEMS.map((item, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              <span className="text-[11px] font-medium tracking-wide">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
