import { ExternalLink, Copy, ThumbsUp, ThumbsDown, Download, Filter, ArrowUpDown, Check, Activity } from "lucide-react";
import { useState, useMemo } from "react";
import { Sparkline } from "./Sparkline";

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
    <div className="flex-1 overflow-y-auto p-2 bg-white dark:bg-stone-950">
      <div className="max-w-5xl mx-auto">
        {/* Answer Summary */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">Analyse</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopyAnalysis}
                className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors" 
                title="Kopier"
              >
                <Copy className="size-4 text-stone-700 dark:text-stone-300" />
              </button>
              <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors" title="Nyttig">
                <ThumbsUp className="size-4 text-stone-700 dark:text-stone-300" />
              </button>
              <button className="p-1.5 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-colors" title="Ikke nyttig">
                <ThumbsDown className="size-4 text-stone-700 dark:text-stone-300" />
              </button>
              
              {/* Export Button with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                  title="Eksporter"
                >
                  <Download className="size-4" />
                  <span>Eksporter</span>
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                    <div className="py-1">
                      <button 
                        onClick={() => handleExport("pdf")}
                        className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        Eksporter som PDF
                      </button>
                      <button 
                        onClick={() => handleExport("docx")}
                        className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        Eksporter som DOCX
                      </button>
                      <button 
                        onClick={() => handleExport("md")}
                        className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        Eksporter som Markdown
                      </button>
                      <div className="border-t border-stone-200 dark:border-stone-700 my-1"></div>
                      <button 
                        onClick={() => handleExport("email")}
                        className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                      >
                        Send via e-mail
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="prose prose-stone dark:prose-invert prose-sm max-w-none text-[13px] leading-snug">
            <p className="text-stone-800 dark:text-stone-300">
              China's semiconductor sector is experiencing accelerated development through substantial state funding and policy support 
              <sup 
                className="text-[#E94E3D] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(1)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[1]</sup>. The National Development and Reform Commission (NDRC) has established a comprehensive framework targeting strategic industries, with semiconductor manufacturing as a priority sector 
              <sup 
                className="text-[#E94E3D] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(2)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[2]</sup>.
            </p>
            <p className="text-stone-800 dark:text-stone-300">
              This policy push is occurring against the backdrop of evolving global supply chain dynamics, particularly affecting the semiconductor industry. Regional manufacturers in Japan and South Korea are actively diversifying their production networks to mitigate geopolitical risks 
              <sup 
                className="text-[#E94E3D] font-medium cursor-pointer hover:underline px-0.5"
                onMouseEnter={() => setHoveredCitationId(3)}
                onMouseLeave={() => setHoveredCitationId(null)}
              >[3]</sup>.
            </p>
            <p className="text-stone-800 dark:text-stone-300">
              The implications for global trade patterns suggest a continued bifurcation of technology supply chains, with distinct ecosystems emerging around major economic blocs. Investment flows are increasingly directed toward building redundant capacity and establishing alternative sourcing relationships.
            </p>
          </div>
        </div>

        {/* Citations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-black dark:text-white">Citater & kilder</h3>
            
            {/* Filter and Sort Controls */}
            <div className="flex items-center gap-2">
              {/* Filter by Source */}
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                >
                  <Filter className="size-3.5" />
                  <span>{filterSource === "all" ? "Alle kilder" : filterSource}</span>
                </button>
                
                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                    <div className="py-1">
                      {sources.map((source) => (
                        <button
                          key={source}
                          onClick={() => {
                            setFilterSource(source);
                            setShowFilterMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                        >
                          <span className="capitalize">{source === "all" ? "Alle" : source}</span>
                          {filterSource === source && <Check className="size-3 text-black dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sort By */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu(!showSortMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                >
                  <ArrowUpDown className="size-3.5" />
                  <span className="capitalize">{sortBy === "relevance" ? "Relevans" : sortBy === "date" ? "Dato" : "Kilde"}</span>
                </button>
                
                {showSortMenu && (
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                    <div className="py-1">
                      {[
                        { value: "relevance" as SortOption, label: "Relevans" },
                        { value: "date" as SortOption, label: "Dato" },
                        { value: "source" as SortOption, label: "Kilde" }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortMenu(false);
                          }}
                          className="w-full text-left px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                        >
                          <span>{option.label}</span>
                          {sortBy === option.value && <Check className="size-3 text-black dark:text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
          <div className="space-y-1">
            {citations.map((citation) => (
              <a
                href={citation.url}
                key={citation.id}
                className={`block pl-4 pr-2 py-3 border hover:border-stone-400 dark:hover:border-stone-500 transition-all duration-200 group relative rounded-sm ${
                  hoveredCitationId === citation.id
                    ? "bg-stone-50 dark:bg-stone-800 border-stone-400 dark:border-stone-500 shadow-md scale-[1.005] z-10"
                    : "bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800"
                }`}
              >
                {/* Visual Accent Line (Left Border) - Danger states */}
                <div className="absolute left-0 top-0 bottom-0 w-[3px]">
                   <div 
                     className="absolute inset-0 h-full w-full"
                     style={{ 
                       backgroundColor: citation.relevance && citation.relevance >= 90 ? '#ef4444' /* Red for LIVE/High */ : 
                                        citation.relevance && citation.relevance >= 80 ? '#f59e0b' /* Amber for medium */ :
                                        '#3b82f6' /* Blue for normal */
                     }}
                   ></div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 lg:gap-6 items-start">
                  
                  {/* Main Content Column */}
                  <div className="flex-1 min-w-0 pr-2">
                    
                    {/* Top Label: Condensed Topic */}
                    <div className="flex items-center gap-2 mb-1.5 opacity-80">
                      {citation.topic && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                          {citation.topic}
                        </span>
                      )}
                    </div>

                    {/* Compressed Title */}
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5 leading-snug group-hover:text-black dark:group-hover:text-white transition-colors">
                      {citation.title}
                    </h4>
                    
                    {/* Excerpt */}
                    <p className="text-xs text-stone-700 dark:text-stone-500 leading-tight mb-2 line-clamp-2">
                      {citation.excerpt}
                    </p>

                    {/* Meta at bottom */}
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-stone-600 font-mono">
                         {citation.date}
                       </span>
                    </div>
                  </div>

                  {/* Right Column: Dense Visualizations replacing the photo block */}
                  <div className="w-[180px] shrink-0 border-l border-stone-200 dark:border-stone-800 pl-4 py-1 flex flex-col gap-3">
                     <div className="flex items-center justify-between relative group/tooltip cursor-help">
                       <span className="text-[10px] text-stone-600 dark:text-stone-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                         <Activity className="size-3" /> Signal Strength
                       </span>
                       <span className="text-xs font-bold font-mono" style={{ color: citation.relevance && citation.relevance >= 90 ? '#ef4444' : '#f59e0b' }}>
                         {citation.relevance}%
                       </span>

                       {/* Tooltip for Signal Strength */}
                       <div className="absolute right-0 top-full mt-2 w-48 p-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20">
                         <div className="text-[10px] font-medium text-stone-800 dark:text-stone-300 leading-relaxed normal-case tracking-normal">
                           Signal strength is a composite metric derived from <strong>source momentum</strong>, <strong>credibility weighting</strong>, and <strong>topical relevance</strong> to your intelligence filters.
                         </div>
                       </div>
                     </div>
                     
                     <div className="h-[24px] w-full mt-1">
                       <Sparkline 
                         data={citation.trendData || []} 
                         width={160} 
                         height={24} 
                         color={citation.relevance && citation.relevance >= 90 ? '#ef4444' : '#f59e0b'} 
                       />
                     </div>
                  </div>

                </div>
              </a>
            ))}
          </div>
        </div>

        </div>

        {/* Confidence & Metadata */}
        <div className="mt-4 p-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded">
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-stone-600 dark:text-stone-500">Confidence: </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">High (87%)</span>
              </div>
              <div>
                <span className="text-stone-600 dark:text-stone-500">Sources: </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">{citations.length} primary, 12 supporting</span>
              </div>
              <div>
                <span className="text-stone-600 dark:text-stone-500">Last updated: </span>
                <span className="font-bold text-stone-900 dark:text-stone-100">2 hours ago</span>
              </div>
            </div>
            <button className="text-stone-600 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-300 underline underline-offset-2 transition-colors">
              View Methodology
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}