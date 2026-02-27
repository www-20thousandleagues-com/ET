import { ExternalLink, Copy, ThumbsUp, ThumbsDown, Download, Filter, ArrowUpDown, Check } from "lucide-react";
import { useState, useMemo } from "react";

type SortOption = "date" | "relevance" | "source";
type Citation = {
  id: number;
  source: string;
  title: string;
  date: string;
  excerpt: string;
  url: string;
  relevance?: number;
};

export function AnswerArea() {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const allCitations: Citation[] = [
    {
      id: 1,
      source: "FT",
      title: "China's semiconductor push gains momentum amid export controls",
      date: "Jan 12, 2026",
      excerpt: "Beijing announces $50B fund for chip manufacturing self-sufficiency...",
      url: "#",
      relevance: 95,
    },
    {
      id: 2,
      source: "Caixin",
      title: "New policy framework targets strategic industries",
      date: "Jan 10, 2026",
      excerpt: "NDRC releases guidelines prioritizing advanced manufacturing sectors...",
      url: "#",
      relevance: 88,
    },
    {
      id: 3,
      source: "Nikkei",
      title: "Asian supply chains adapt to geopolitical pressures",
      date: "Jan 8, 2026",
      excerpt: "Japanese firms accelerate diversification strategies across Southeast Asia...",
      url: "#",
      relevance: 82,
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
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-stone-950">
      <div className="max-w-4xl">
        {/* Answer Summary */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
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
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-10">
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
          
          <div className="prose prose-stone prose-sm max-w-none">
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
              China's semiconductor sector is experiencing accelerated development through substantial state funding and policy support <sup className="text-[#E94E3D] font-medium cursor-pointer hover:underline">[1]</sup>. The National Development and Reform Commission (NDRC) has established a comprehensive framework targeting strategic industries, with semiconductor manufacturing as a priority sector <sup className="text-[#E94E3D] font-medium cursor-pointer hover:underline">[2]</sup>.
            </p>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
              This policy push is occurring against the backdrop of evolving global supply chain dynamics, particularly affecting the semiconductor industry. Regional manufacturers in Japan and South Korea are actively diversifying their production networks to mitigate geopolitical risks <sup className="text-[#E94E3D] font-medium cursor-pointer hover:underline">[3]</sup>.
            </p>
            <p className="text-stone-800 dark:text-stone-200 leading-relaxed">
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
                  <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-10">
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
                  <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-10">
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
            {citations.map((citation) => (
              <div
                key={citation.id}
                className="p-4 border-2 border-stone-200 dark:border-stone-700 rounded hover:border-stone-400 dark:hover:border-stone-500 transition-colors group bg-white dark:bg-stone-900"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-stone-600 dark:text-stone-400">[{citation.id}]</span>
                      <span className="text-xs font-bold text-black dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                        {citation.source}
                      </span>
                      <span className="text-xs text-stone-600 dark:text-stone-400">{citation.date}</span>
                      {sortBy === "relevance" && citation.relevance && (
                        <span className="text-xs text-stone-600 dark:text-stone-400">• {citation.relevance}% match</span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-black dark:text-white mb-1 group-hover:text-[#E94E3D] transition-colors">
                      {citation.title}
                    </h4>
                    <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{citation.excerpt}</p>
                  </div>
                  <a
                    href={citation.url}
                    className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-stone-100 dark:hover:bg-stone-800 rounded transition-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="size-4 text-stone-700 dark:text-stone-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence & Metadata */}
        <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-900 rounded border-2 border-stone-200 dark:border-stone-700">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-stone-700 dark:text-stone-300">Tillid: </span>
                <span className="font-bold text-black dark:text-white">Høj (87%)</span>
              </div>
              <div>
                <span className="text-stone-700 dark:text-stone-300">Kilder: </span>
                <span className="font-bold text-black dark:text-white">{citations.length} primære, 12 støttende</span>
              </div>
              <div>
                <span className="text-stone-700 dark:text-stone-300">Sidst opdateret: </span>
                <span className="font-bold text-black dark:text-white">2 timer siden</span>
              </div>
            </div>
            <button className="text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors">
              Se metode
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}