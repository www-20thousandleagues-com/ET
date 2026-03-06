import { ExternalLink, Copy, ThumbsUp, ThumbsDown, Download, Filter, ArrowUpDown, Check, SearchX, AlertTriangle, Info, X, ArrowLeft, Newspaper, Globe } from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { Skeleton } from "@/app/components/ui/skeleton";
import type { RagAnalysis, RagCitation, WebResult } from "@/types/database";

type SortOption = "date" | "relevance" | "source";

function getConfidenceLabel(confidence: number, t: ReturnType<typeof useLocaleStore.getState>["t"]) {
  if (confidence >= 70) return t.answer.high;
  if (confidence >= 40) return t.answer.medium;
  return t.answer.low;
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

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

// --- Sub-components ---

function SourceArticleView() {
  const selectedSource = useAppStore((s) => s.selectedSource);
  const sourceArticles = useAppStore((s) => s.sourceArticles);
  const sourceArticlesLoading = useAppStore((s) => s.sourceArticlesLoading);
  const clearSelectedSource = useAppStore((s) => s.clearSelectedSource);
  const t = useLocaleStore((s) => s.t);

  if (!selectedSource) return null;

  if (sourceArticlesLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-4xl space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={clearSelectedSource}
            className="p-1.5 rounded hover:bg-accent transition-colors"
            aria-label={t.answer.goBack}
          >
            <ArrowLeft className="size-4 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Newspaper className="size-5 text-brand" />
            <h2 className="text-lg font-bold text-foreground">{selectedSource.name}</h2>
          </div>
          <span className="text-sm text-muted-foreground">
            {sourceArticles.length} {sourceArticles.length === 1 ? t.answer.article : t.answer.articles}
          </span>
        </div>

        {sourceArticles.length > 0 ? (
          <div className="space-y-2">
            {sourceArticles.map((article) => (
              <a
                key={article.id}
                href={isSafeUrl(article.url) ? article.url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 border-2 border-border rounded hover:border-brand transition-colors group bg-card"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.source_name}</span>
                      <span>&bull;</span>
                      <span>{new Date(article.published_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchX className="size-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">{t.answer.noArticlesForSource}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MethodologyModal({ onClose, sourceCount }: { onClose: () => void; sourceCount: number }) {
  const t = useLocaleStore((s) => s.t);

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/4 max-w-lg mx-auto bg-card border-2 border-foreground rounded-lg shadow-xl z-50 p-6" role="dialog" aria-modal="true" aria-label={t.answer.viewMethodology}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info className="size-5 text-brand" />
            <h3 className="font-bold text-foreground">{t.answer.viewMethodology}</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded" aria-label={t.answer.close}>
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong>1. Vector Search:</strong> {t.answer.methodologyVectorSearch}</p>
          <p><strong>2. Reranking:</strong> {t.answer.methodologyReranking}</p>
          <p><strong>3. AI Synthesis:</strong> {t.answer.methodologySynthesis}</p>
          <p><strong>4. Confidence Score:</strong> {t.answer.methodologyConfidence}</p>
          <p className="text-xs text-muted-foreground pt-2 border-t border-border">{t.answer.methodologyFooter.replace("{count}", String(sourceCount))}</p>
        </div>
      </div>
    </>
  );
}

function CitationList({ citations, sortBy, t }: { citations: RagCitation[]; sortBy: SortOption; t: ReturnType<typeof useLocaleStore.getState>["t"] }) {
  return (
    <div className="space-y-3">
      {citations.map((citation) => (
        <div
          key={citation.id}
          className="p-4 border-2 border-border rounded hover:border-muted-foreground transition-colors group bg-card"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-muted-foreground">[{citation.position}]</span>
                <span className="text-xs font-bold text-foreground bg-accent px-2 py-0.5 rounded">
                  {citation.source_name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(citation.published_at).toLocaleDateString()}
                </span>
                {sortBy === "relevance" && (
                  <span className="text-xs text-muted-foreground">
                    &bull; {citation.relevance_score}% {t.answer.match}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
                {citation.title}
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{citation.excerpt}</p>
            </div>
            <a
              href={isSafeUrl(citation.url) ? citation.url : "#"}
              className="flex-shrink-0 p-2 opacity-0 group-hover:opacity-100 hover:bg-accent rounded transition-all"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open article: ${citation.title}`}
            >
              <ExternalLink className="size-4 text-muted-foreground" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function WebResultsList({ results, t }: { results: WebResult[]; t: ReturnType<typeof useLocaleStore.getState>["t"] }) {
  if (results.length === 0) return null;
  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="size-4 text-brand" />
        <h3 className="text-sm font-bold text-foreground">{t.answer.liveWebResults}</h3>
        <span className="text-xs text-muted-foreground">({results.length})</span>
      </div>
      <div className="space-y-3">
        {results.map((r, i) => (
          <a
            key={`${r.url}-${i}`}
            href={isSafeUrl(r.url) ? r.url : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border-2 border-border rounded hover:border-brand transition-colors group bg-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-foreground bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded">
                    {t.answer.web}
                  </span>
                  {r.published_date && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.published_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-medium text-foreground mb-1 group-hover:text-brand transition-colors">
                  {r.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.content}</p>
              </div>
              <ExternalLink className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// --- Main component ---

export function AnswerArea() {
  const currentQuery = useAppStore((s) => s.currentQuery);
  const queryLoading = useAppStore((s) => s.queryLoading);
  const queryError = useAppStore((s) => s.queryError);
  const selectedSource = useAppStore((s) => s.selectedSource);
  const sources = useAppStore((s) => s.sources);
  const submitFeedback = useAppStore((s) => s.submitFeedback);
  const t = useLocaleStore((s) => s.t);
  const webResults = currentQuery?.webResults ?? [];

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<"export" | "sort" | "filter" | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Cleanup copied timer on unmount
  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  const analysis = currentQuery?.analysis;
  const allCitations = analysis?.citations ?? [];

  const sourceNames = useMemo(
    () => ["all", ...Array.from(new Set(allCitations.map((c) => c.source_name)))],
    [allCitations]
  );

  const citations = useMemo(() => {
    const filtered = filterSource === "all"
      ? allCitations
      : allCitations.filter((c) => c.source_name === filterSource);

    return [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
      } else if (sortBy === "relevance") {
        return b.relevance_score - a.relevance_score;
      } else if (sortBy === "source") {
        return a.source_name.localeCompare(b.source_name);
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
    title: c.title,
    source: c.source_name,
    url: c.url,
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
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Last resort: open in new window for manual copy (XSS-safe)
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<pre>${escapeHtml(text)}</pre>`);
        w.document.close();
      }
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
    setActiveMenu(null);
  }, [analysis, currentQuery, citationData]);

  // Loading state
  if (queryLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-background">
        <div className="max-w-4xl space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-16 w-3/4" />
        </div>
      </div>
    );
  }

  // Source browsing view (extracted component)
  if (selectedSource) {
    return <SourceArticleView />;
  }

  // Error state
  if (queryError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <AlertTriangle className="size-12 text-brand mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.answer.analysisFailed}</h3>
          <p className="text-sm text-muted-foreground">{queryError}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!analysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <SearchX className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.answer.noAnalysis}</h3>
          <p className="text-sm text-muted-foreground">{t.answer.noAnalysisHint}</p>
        </div>
      </div>
    );
  }

  const activeSourceCount = sources.filter((s) => s.article_count > 0).length || sourceNames.length - 1;

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background">
      <div className="max-w-4xl">
        {showMethodology && (
          <MethodologyModal onClose={() => setShowMethodology(false)} sourceCount={activeSourceCount} />
        )}

        {/* Analysis content */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{t.answer.analysis}</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className={`p-1.5 rounded transition-colors ${copied ? "bg-green-100 dark:bg-green-900" : "hover:bg-accent"}`}
                title={t.common.copy}
                aria-label={t.common.copy}
              >
                {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-muted-foreground" />}
              </button>
              <button
                onClick={() => { const val = feedback === "up" ? null : "up"; setFeedback(val); if (val && currentQuery) submitFeedback(currentQuery.id, val); }}
                className={`p-1.5 rounded transition-colors ${feedback === "up" ? "bg-green-100 dark:bg-green-900" : "hover:bg-accent"}`}
                title={t.common.helpful}
                aria-label={t.common.helpful}
              >
                <ThumbsUp className={`size-4 ${feedback === "up" ? "text-green-600" : "text-muted-foreground"}`} />
              </button>
              <button
                onClick={() => { const val = feedback === "down" ? null : "down"; setFeedback(val); if (val && currentQuery) submitFeedback(currentQuery.id, val); }}
                className={`p-1.5 rounded transition-colors ${feedback === "down" ? "bg-red-100 dark:bg-red-900" : "hover:bg-accent"}`}
                title={t.common.notHelpful}
                aria-label={t.common.notHelpful}
              >
                <ThumbsDown className={`size-4 ${feedback === "down" ? "text-brand" : "text-muted-foreground"}`} />
              </button>

              {/* Export dropdown */}
              <div className="relative">
                <button
                  onClick={() => setActiveMenu(activeMenu === "export" ? null : "export")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
                  aria-label={t.common.export}
                >
                  <Download className="size-4" />
                  <span>{t.common.export}</span>
                </button>
                {activeMenu === "export" && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                    <div className="absolute right-0 top-full mt-1 w-48 bg-card border-2 border-foreground rounded shadow-lg z-20">
                      <div className="py-1">
                        <button onClick={() => handleExport("md")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                          {t.common.exportMd}
                        </button>
                        <button onClick={() => handleExport("txt")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                          {t.answer.exportText}
                        </button>
                        <div className="border-t border-border my-1" />
                        <button onClick={() => handleExport("email")} className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors">
                          {t.common.sendEmail}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="prose prose-stone prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {analysis.content}
          </div>
        </div>

        {/* Citations */}
        {citations.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-foreground">{t.answer.citationsAndSources}</h3>
              <div className="flex items-center gap-2">
                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenu(activeMenu === "filter" ? null : "filter")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
                    aria-label={t.answer.filterBySource}
                  >
                    <Filter className="size-3.5" />
                    <span>{filterSource === "all" ? t.common.allSources : filterSource}</span>
                  </button>
                  {activeMenu === "filter" && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-card border-2 border-foreground rounded shadow-lg z-20">
                        <div className="py-1">
                          {sourceNames.map((source) => (
                            <button
                              key={source}
                              onClick={() => { setFilterSource(source); setActiveMenu(null); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between"
                            >
                              <span>{source === "all" ? t.answer.all : source}</span>
                              {filterSource === source && <Check className="size-3 text-foreground" />}
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
                    onClick={() => setActiveMenu(activeMenu === "sort" ? null : "sort")}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
                    aria-label={t.answer.sortCitations}
                  >
                    <ArrowUpDown className="size-3.5" />
                    <span>{sortLabels[sortBy]}</span>
                  </button>
                  {activeMenu === "sort" && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                      <div className="absolute right-0 top-full mt-1 w-32 bg-card border-2 border-foreground rounded shadow-lg z-20">
                        <div className="py-1">
                          {(["relevance", "date", "source"] as SortOption[]).map((opt) => (
                            <button
                              key={opt}
                              onClick={() => { setSortBy(opt); setActiveMenu(null); }}
                              className="w-full text-left px-3 py-1.5 text-xs text-foreground hover:bg-accent transition-colors flex items-center justify-between"
                            >
                              <span>{sortLabels[opt]}</span>
                              {sortBy === opt && <Check className="size-3 text-foreground" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <CitationList citations={citations} sortBy={sortBy} t={t} />
          </div>
        )}

        {/* Web search results */}
        <WebResultsList results={webResults} t={t} />

        {/* Confidence metadata */}
        {analysis && (
          <div className="mt-6 p-4 bg-accent rounded border-2 border-border">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-muted-foreground">{t.answer.confidence}: </span>
                  <span className="font-bold text-foreground">{getConfidenceLabel(analysis.confidence, t)} ({analysis.confidence}%)</span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.answer.sourcesLabel}: </span>
                  <span className="font-bold text-foreground">
                    {analysis.primary_source_count} {t.answer.primary}, {analysis.supporting_source_count} {t.answer.supporting}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">{t.answer.lastUpdated}: </span>
                  <span className="font-bold text-foreground">{new Date(analysis.created_at).toLocaleString()}</span>
                </div>
              </div>
              <button
                onClick={() => setShowMethodology(true)}
                className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
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
