import { Database, Zap, BrainCircuit, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

export function IngestionHUD() {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Card 1: Sources */}
      <div className="bg-[#0a0a0b] border border-[#1C1C1D] rounded-xl p-5 flex flex-col justify-between h-[120px]">
        <div className="flex items-start justify-between">
          <div className="p-1.5 bg-[#1C1C1D] rounded text-stone-400">
            <Database className="size-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5F5F5F]">
            RSS / API
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-none tracking-tight mb-1 font-sans">17+</h3>
          <p className="text-[11px] font-medium text-[#7D7D82]">{t('hud.sources_monitored')}</p>
        </div>
      </div>

      {/* Card 2: Update Cycle */}
      <div className="bg-[#0a0a0b] border border-[#1C1C1D] rounded-xl p-5 flex flex-col justify-between h-[120px]">
        <div className="flex items-start justify-between">
          <div className="p-1.5 bg-[#1C1C1D] rounded text-stone-400">
            <Zap className="size-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5F5F5F]">
            Automated
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-none tracking-tight mb-1 font-sans">6 {t('hud.hours')}</h3>
          <p className="text-[11px] font-medium text-[#7D7D82]">{t('hud.update_cycle')}</p>
        </div>
      </div>

      {/* Card 3: Engine */}
      <div className="bg-[#0a0a0b] border border-[#1C1C1D] rounded-xl p-5 flex flex-col justify-between h-[120px]">
        <div className="flex items-start justify-between">
          <div className="p-1.5 bg-[#1C1C1D] rounded text-stone-400">
            <BrainCircuit className="size-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5F5F5F]">
            RAG + Synthesis
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-none tracking-tight mb-1 font-sans">Claude AI</h3>
          <p className="text-[11px] font-medium text-[#7D7D82]">{t('hud.analysis_engine')}</p>
        </div>
      </div>

      {/* Card 4: Geography */}
      <div className="bg-[#0a0a0b] border border-[#1C1C1D] rounded-xl p-5 flex flex-col justify-between h-[120px]">
        <div className="flex items-start justify-between">
          <div className="p-1.5 bg-[#1C1C1D] rounded text-stone-400">
            <Globe className="size-4" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#5F5F5F]">
            Global
          </span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white leading-none tracking-tight mb-1 font-sans">24/7</h3>
          <p className="text-[11px] font-medium text-[#7D7D82]">{t('hud.global_coverage')}</p>
        </div>
      </div>

    </div>
  );
}
