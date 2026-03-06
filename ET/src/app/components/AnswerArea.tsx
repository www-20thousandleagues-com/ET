import { ExternalLink, Copy, ThumbsUp, ThumbsDown, Download, Filter, ArrowUpDown, Check, SearchX, AlertTriangle, Info, X } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { Skeleton } from "@/app/components/ui/skeleton";

type SortOption = "date" | "relevance" | "source";

function buildMarkdownExport(query: string, content: string, citations: { position: number; title: string; source: string; url: string; excerpt: string }[]) {
  let md = `# Jaegeren Analysis\n\n**Query:** ${query}\n**Date:** ${new Date().toLocaleString()}\n\n## Analysis\n\n${content}\n\n`;
  if (citations.length > 0) {
    md += `## Sources\n\n`;
    for (const c of citations) {
      md += `${c.position}. **${c.title}** — ${c.source}\n   ${c.url}\n   > ${c.excerpt}\n\n`;
    }
  }
  return md;
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function AnswerArea() {
  const currentQuery = useAppStore((s) => s.currentQuery);
  const queryLoading = useAppStore((s) => s.queryLoading);
  const queryError = useAppStore((s) => s.queryError);
  const t = useLocaleStore((s) => s.t);

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);

  const analysis = currentQuery?.analysis;
  const allCitations = analysis?.citations ?? [];

  const sourceNames = useMemo(
    () => ["all", ...Array.from(new Set(allCitations.map((c) => c.article.source.name)))],
    [allCitations]
  );

  const citations = useMemo(() => {
    const filtered = filterSource === "all"
      ? allCitations
      : allCitations.filter((c) => c.article.source.name === filterSource);

    return [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.article.published_at).getTime() - new Date(a.article.published_at).getTime();
      } else if (sortBy === "relevance") {
        return b.relevance_score - a.relevance_score;
      } else if (sortBy === "source") {
        return a.article.source.name.localeCompare(b.article.source.name);
      }
      return 0;
    });
  }, [allCitations, filterSource, sortBy]);

  const sortLabels: Record<SortOption, string> = {
    relevance: t.answer.relevance,
    date: t.answer.date,
    source: t.answer.source,
  };

  const citationData = useMemo(() => allCitations.map((c) => ({
    position: c.position,
    title: c.article.title,
    source: c.article.source.name,
    url: c.article.url,
    excerpt: c.excerpt,
  })), [allCitations]);

  const handleCopy = useCallback(async () => {
    if (!analysis) return;
    const text = analysis.content + "\n\nSources:\n" + citationData.map((c) => `[${c.position}] ${c.title} (${c.source}) — ${c.url}`).join("\n");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for HTTP (non-secure context)
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: open in new window for manual copy
      const w = window.open("", "_blank");
      if (w) { w.document.write(`<pre>${text}</pre>`); }
    }
  }, [analysis, citationData]);

  const handleExport = useCallback((format: string) => {
    if (!analysis || !currentQuery) return;
    const md = buildMarkdownExport(currentQuery.query_text, analysis.content, citationData);
    if (format === "md") {
      downloadFile(md, `jaegeren-analysis-${Date.now()}.md`, "text/markdown");
    } else if (format === "txt") {
      downloadFile(md, `jaegeren-analysis-${Date.now()}.txt`, "text/plain");
    } else if (format === "email") {
      const subject = encodeURIComponent(`Jaegeren Analysis: ${currentQuery.query_text}`);
      const body = encodeURIComponent(md);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
    setShowExportMenu(false);
  }, [analysis, currentQuery, citationData]);

  // Loading state
  if (queryLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-stone-950">
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-3/4" />
        </div>
      </div>
    );
  }

  // Error state
  if (queryError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-stone-950">
        <div className="text-center max-w-md">
          <AlertTriangle className="size-12 text-[#E94E3D] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
            Analysis failed
          </h3>
          <p className="text-sm text-stone-500">{queryError}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!analysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-stone-950">
        <div className="text-center max-w-md">
          <SearchX className="size-12 text-stone-300 dark:text-stone-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-700 dark:text-stone-300 mb-2">
            {t.answer.noAnalysis}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-500">
            {t.answer.noAnalysisHint}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-stone-950">
      <div className="max-w-4xl">
        {/* Methodology modal */}
        {showMethodology && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setShowMethodology(false)} />
            <div className="fixed inset-x-4 top-1/4 max-w-lg mx-auto bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded-lg shadow-xl z-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Info className="size-5 text-[#E94E3D]" />
                  <h3 className="font-bold text-black dark:text-white">{t.answer.viewMethodology}</h3>
                </div>
                <button onClick={() => setShowMethodology(false)} className="p-1 hover:bg-stone-100 dark:hover:bg-stone-800 rounded">
                  <X className="size-4" />
                </button>
              </div>
              <div className="space-y-3 text-sm text-stone-700 dark:text-stone-300">
                <p><strong>1. Vector Search:</strong> Your query is embedded using multilingual-e5-large (1024d) and matched against {allCitations.length > 0 ? "137+" : "our"} indexed articles in Pinecone.</p>
                <p><strong>2. Reranking:</strong> Top 5 results are reranked using bge-reranker-v2-m3 to select the 3 most relevant passages.</p>
                <p><strong>3. AI Synthesis:</strong> Claude Sonnet synthesizes an analysis from the retrieved context, with inline citation markers [1], [2], [3].</p>
                <p><strong>4. Confidence Score:</strong> Based on source agreement, recency, and coverage breadth. Above 70% = High confidence.</p>
                <p className="text-xs text-stone-500 pt-2 border-t border-stone-200 dark:border-stone-700">Sources are ingested every 2 hours from {sourceNames.length - 1 || 8} active feeds via automated RSS pipeline.</p>
              </div>
            </div>
          </>
        )}

        {/* Analysis content */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wide">
              {t.answer.analysis}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded transition-colors ${copied ? "bg-green-100 dark:bg-green-900" : "hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                title={t.common.copy}
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-stone-700 dark:text-stone-300" />}
              </button>
              <button
                onClick={() => setFeedback(feedback === "up" ? null : "up")}
                className={`p-1.5 rounded transition-colors ${feedback === "up" ? "bg-green-100 dark:bg-green-900" : "hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                title={t.common.helpful}
              >
                <ThumbsUp className={`size-4 ${feedback === "up" ? "text-green-600" : "text-stone-700 dark:text-stone-300"}`} />
              </button>
              <button
                onClick={() => setFeedback(feedback === "down" ? null : "down")}
                className={`p-1.5 rounded transition-colors ${feedback === "down" ? "bg-red-100 dark:bg-red-900" : "hover:bg-stone-100 dark:hover:bg-stone-800"}`}
                title={t.common.notHelpful}
              >
                <ThumbsDown className={`size-4 ${feedback === "down" ? "text-[#E94E3D]" : "text-stone-700 dark:text-stone-300"}`} />
              </button>

              {/* Export dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                >
                  <Download className="size-4" />
                  <span>{t.common.export}</span>
                </button>
                {showExportMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                      <div className="py-1">
                        <button onClick={() => handleExport("md")} className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                          {t.common.exportMd}
                        </button>
                        <button onClick={() => handleExport("txt")} className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                          Export as Text
                        </button>
                        <div className="border-t border-stone-200 dark:border-stone-700 my-1" />
                        <button onClick={() => handleExport("email")} className="w-full text-left px-4 py-2 text-sm text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors">
                          {t.common.sendEmail}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-stone prose-sm max-w-none text-stone-800 dark:text-stone-200 leading-relaxed whitespace-pre-line">
            {analysis.content}
          </div>
        </div>

        {/* Citations */}
        {citations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-black dark:text-white">{t.answer.citationsAndSources}</h3>
              <div className="flex items-center gap-2">
                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                  >
                    <Filter className="size-3.5" />
                    <span>{filterSource === "all" ? t.common.allSources : filterSource}</span>
                  </button>
                  {showFilterMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowFilterMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                        <div className="py-1">
                          {sourceNames.map((source) => (
                            <button
                              key={source}
                              onClick={() => { setFilterSource(source); setShowFilterMenu(false); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                            >
                              <span>{source === "all" ? t.answer.all : source}</span>
                              {filterSource === source && <Check className="size-3 text-black dark:text-white" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <button
                    onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-black dark:border-white bg-transparent hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black rounded transition-colors"
                  >
                    <ArrowUpDown className="size-3.5" />
                    <span>{sortLabels[sortBy]}</span>
                  </button>
                  {showSortMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
                      <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-stone-900 border-2 border-black dark:border-white rounded shadow-lg z-20">
                        <div className="py-1">
                          {(["relevance", "date", "source"] as SortOption[]).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setShowSortMenu(false); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-stone-900 dark:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors flex items-center justify-between"
                            >
                              <span>{sortLabels[opt]}</span>
                              {sortBy === opt && <Check className="size-3 text-black dark:text-white" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
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
                        <span className="text-xs font-medium text-stone-600 dark:text-stone-400">[{citation.position}]</span>
                        <span className="text-xs font-bold text-black dark:text-white bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                          {citation.article.source.name}
                        </span>
                        <span className="text-xs text-stone-600 dark:text-stone-400">
                          {new Date(citation.article.published_at).toLocaleDateString()}
                        </span>
                        {sortBy === "relevance" && (
                          <span className="text-xs text-stone-600 dark:text-stone-400">
                            &bull; {citation.relevance_score}% {t.answer.match}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-black dark:text-white mb-1 group-hover:text-[#E94E3D] transition-colors">
                        {citation.article.title}
                      </h4>
                      <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">{citation.excerpt}</p>
                    </div>
                    <a
                      href={citation.article.url}
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
        )}

        {/* Confidence metadata */}
        {analysis && (
          <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-900 rounded border-2 border-stone-200 dark:border-stone-700">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-stone-700 dark:text-stone-300">{t.answer.confidence}: </span>
                  <span className="font-bold text-black dark:text-white">{t.answer.high} ({analysis.confidence}%)</span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">{t.answer.sourcesLabel}: </span>
                  <span className="font-bold text-black dark:text-white">
                    {analysis.primary_source_count} {t.answer.primary}, {analysis.supporting_source_count} {t.answer.supporting}
                  </span>
                </div>
                <div>
                  <span className="text-stone-700 dark:text-stone-300">{t.answer.lastUpdated}: </span>
                  <span className="font-bold text-black dark:text-white">{new Date(analysis.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowMethodology(true)}
                className="text-stone-700 dark:text-stone-300 hover:text-black dark:hover:text-white underline underline-offset-2 transition-colors"
              >
                {t.answer.viewMethodology}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
