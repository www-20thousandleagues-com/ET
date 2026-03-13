import { Download, Filter, ArrowUpDown, Check, BarChart3 } from "lucide-react";
import { useState, useMemo } from "react";
import { Sparkline } from "./Sparkline";
import { useTranslation } from "react-i18next";

type SortOption = "date" | "relevance" | "source";
type Citation = {
  id: number;
  source: string;
  title: string;
  date: string;
  excerpt: string;
  url: string;
  relevance?: number;
  topic?: string;
  flagImg?: string;
  orgLogo?: string;
  companyLogo?: string;
  trendData?: number[];
};

export function AnswerArea() {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [hoveredCitationId, setHoveredCitationId] = useState<number | null>(null);

  const allCitations: Citation[] = [
    {
      id: 1,
      source: "FT",
      title: "China's semiconductor push gains momentum amid export controls",
      date: "Jan 12, 2026",
      excerpt: "Beijing announces $50B fund for chip manufacturing self-sufficiency...",
      url: "#",
      relevance: 95,
      topic: "Tech Regulation",
      flagImg: "https://flagcdn.com/w40/cn.png",
      orgLogo: "https://upload.wikimedia.org/wikipedia/commons/4/41/Financial_Times_corporate_logo.svg",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/0/00/SMIC_logo.svg",
      trendData: [45, 48, 42, 55, 68, 72, 85, 95]
    },
    {
      id: 2,
      source: "Caixin",
      title: "New policy framework targets strategic industries",
      date: "Jan 10, 2026",
      excerpt: "NDRC releases guidelines prioritizing advanced manufacturing sectors...",
      url: "#",
      relevance: 88,
      topic: "Strategic Policy",
      flagImg: "https://flagcdn.com/w40/cn.png",
      orgLogo: "https://upload.wikimedia.org/wikipedia/en/2/23/Caixin_logo.svg",
      companyLogo: "https://ui-avatars.com/api/?name=NDRC&background=0D8ABC&color=fff&rounded=true&font-size=0.4",
      trendData: [60, 58, 62, 65, 70, 68, 80, 88]
    },
    {
      id: 3,
      source: "Nikkei",
      title: "Asian supply chains adapt to geopolitical pressures",
      date: "Jan 8, 2026",
      excerpt: "Japanese firms accelerate diversification strategies across Southeast Asia...",
      url: "#",
      relevance: 82,
      topic: "Supply Chain",
      flagImg: "https://flagcdn.com/w40/jp.png",
      orgLogo: "https://upload.wikimedia.org/wikipedia/commons/8/87/Nikkei_Inc._logo.svg",
      companyLogo: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg",
      trendData: [75, 70, 68, 65, 60, 58, 55, 50]
    },
  ];

  const sources = ["all", ...Array.from(new Set(allCitations.map((c) => c.source)))];

  const citations = useMemo(() => {
    let filtered = filterSource === "all" 
      ? allCitations 
      : allCitations.filter((c) => c.source === filterSource);

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "relevance") {
        return (b.relevance || 0) - (a.relevance || 0);
      } else if (sortBy === "source") {
        return a.source.localeCompare(b.source);
      }
      return 0;
    });

    return sorted;
  }, [filterSource, sortBy]);

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}...`);
    // Placeholder for export functionality
    setShowExportMenu(false);
  };

  const handleCopyAnalysis = () => {
    console.log("Analysis copied to clipboard");
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0a0a0b]">
      <div className="max-w-[1800px] mx-auto">
        {/* Answer Summary */}
        <div className="mb-8 border-b border-[#1C1C1D] pb-8">
          
          {/* Header Row: Analyse + Badges */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[15px] font-bold text-white flex items-center gap-2">
              <BarChart3 className="size-4 text-[#ef4444]" /> {t('analysis.title')}
            </h2>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full border border-[#059669]/30 bg-[#059669]/10">
                <span className="text-[11px] font-bold text-[#10b981] tracking-wide">{t('analysis.confidence')} 87%</span>
              </div>
              <span className="text-[12px] text-stone-400">4 {t('analysis.sources')}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none text-[15px] leading-relaxed text-[#7D7D82]">
            <p className="mb-4">
              China's semiconductor sector is experiencing accelerated development through substantial state funding and policy support 
              <sup 
                className="text-[#ef4444] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(1)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[1]</sup>. The National Development and Reform Commission (NDRC) has established a comprehensive framework targeting strategic industries, with semiconductor manufacturing as a priority sector 
              <sup 
                className="text-[#ef4444] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(2)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[2]</sup>.
            </p>
            <p className="mb-4">
              This policy push is occurring against the backdrop of evolving global supply chain dynamics, particularly affecting the semiconductor industry. Regional manufacturers in Japan and South Korea are actively diversifying their production networks to mitigate geopolitical risks 
              <sup 
                className="text-[#ef4444] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(3)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[3]</sup>.
            </p>
            <p>
              The implications for global trade patterns suggest a continued bifurcation of technology supply chains, with distinct ecosystems emerging around major economic blocs. Investment flows are increasingly directed toward building redundant capacity and establishing alternative sourcing relationships.
            </p>
          </div>

          {/* Inline Citation Pills (From Mockup) */}
          <div className="flex flex-wrap items-center gap-3 mt-8">
            {citations.map((c) => (
              <a 
                key={c.id} 
                href={c.url}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#1C1C1D] bg-[#111112] hover:bg-[#1C1C1D] transition-colors"
                onMouseEnter={() => setHoveredCitationId(c.id)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-[#ef4444]"></div>
                <span className="text-[11px] font-medium text-stone-300">{c.source}</span>
                <span className="text-[10px] text-stone-500 font-mono">{c.relevance}%</span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}