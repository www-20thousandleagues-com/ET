import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";
import { safeFormatDateTime } from "@/lib/utils";
import { toast } from "sonner";
import { useSettingsStore } from "@/stores/settings";
import { OverviewDashboard } from "@/app/components/OverviewDashboard";
import { SavedQueriesView } from "@/app/components/SavedQueriesView";
import { CitationContent } from "@/app/components/answer/CitationContent";
import { ExportMenu, buildMarkdownExport, downloadFile } from "@/app/components/answer/ExportMenu";
import { FeedbackBar } from "@/app/components/answer/FeedbackBar";
import { MethodologyModal } from "@/app/components/answer/MethodologyModal";
import { WebSearchResults } from "@/app/components/answer/WebSearchResults";
import { SourceBrowser } from "@/app/components/answer/SourceBrowser";
import { ProgressiveLoader } from "@/app/components/answer/ProgressiveLoader";
import { CitationListSection } from "@/app/components/answer/CitationList";

type SortOption = "date" | "relevance" | "source";

function getConfidenceLabel(confidence: number, t: ReturnType<typeof useLocaleStore.getState>["t"]) {
  if (confidence >= 70) return t.answer.high;
  if (confidence >= 40) return t.answer.medium;
  return t.answer.low;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

// --- Streaming text reveal hook ---
function useStreamingText(text: string, enabled: boolean): { displayed: string; done: boolean } {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const prevTextRef = useRef("");

  useEffect(() => {
    if (!enabled || !text) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    if (text === prevTextRef.current) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    prevTextRef.current = text;

    setDone(false);
    setDisplayed("");
    let i = 0;
    const chunkSize = 3;
    const interval = setInterval(() => {
      i += chunkSize;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.slice(0, i));
      }
    }, 12);
    return () => clearInterval(interval);
  }, [text, enabled]);

  return { displayed, done };
}

// --- Main component ---

export function AnswerArea() {
  const currentQuery = useAppStore((s) => s.currentQuery);
  const queryLoading = useAppStore((s) => s.queryLoading);
  const queryError = useAppStore((s) => s.queryError);
  const loadingPhase = useAppStore((s) => s.loadingPhase);
  const selectedSource = useAppStore((s) => s.selectedSource);
  const sources = useAppStore((s) => s.sources);
  const submitFeedback = useAppStore((s) => s.submitFeedback);
  const toggleSaveQuery = useAppStore((s) => s.toggleSaveQuery);
  const submitQuery = useAppStore((s) => s.submitQuery);
  const clearError = useAppStore((s) => s.clearError);
  const goHome = useAppStore((s) => s.goHome);
  const t = useLocaleStore((s) => s.t);
  const webResults = currentQuery?.webResults ?? [];
  const showSavedQueriesView = useAppStore((s) => s.showSavedQueries);
  const setShowSavedQueries = useAppStore((s) => s.setShowSavedQueries);
  const showCitationBrackets = useSettingsStore((s) => s.showCitationBrackets);
  const toggleCitationBrackets = useSettingsStore((s) => s.toggleCitationBrackets);

  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [activeMenu, setActiveMenu] = useState<"export" | "sort" | "filter" | null>(null);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showMethodology, setShowMethodology] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [streamingEnabled] = useState(true);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setFeedback(null);
  }, [currentQuery?.id]);

  const analysis = currentQuery?.analysis;
  const allCitations = analysis?.citations ?? [];

  const { displayed: streamedContent, done: streamDone } = useStreamingText(
    analysis?.content ?? "",
    streamingEnabled
  );

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

  const citationData = useMemo(() => allCitations.map((c) => ({
    position: c.position,
    title: c.title,
    source: c.source_name,
    url: c.url,
    excerpt: c.excerpt,
  })), [allCitations]);

  const handleCopy = useCallback(async () => {
    if (!analysis) return;
    const text = analysis.content + `\n\n${t.export.sourcesSuffix}:\n` + citationData.map((c) => `[${c.position}] ${c.title} (${c.source}) — ${c.url}`).join("\n");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
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
      toast.success(t.common.copied);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<pre>${escapeHtml(text)}</pre>`);
        w.document.close();
      }
    }
  }, [analysis, citationData, t]);

  const handleExport = useCallback((format: string) => {
    if (!analysis || !currentQuery) return;
    const md = buildMarkdownExport(currentQuery.query_text, analysis.content, citationData, t);
    if (format === "md") {
      downloadFile(md, `jaegeren-analysis-${Date.now()}.md`, "text/markdown");
      toast.success(t.common.exportedMd);
    } else if (format === "txt") {
      downloadFile(md, `jaegeren-analysis-${Date.now()}.txt`, "text/plain");
      toast.success(t.common.exportedTxt);
    } else if (format === "email") {
      const subject = encodeURIComponent(`${t.export.title}: ${currentQuery.query_text}`);
      const body = encodeURIComponent(md);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    }
    setActiveMenu(null);
  }, [analysis, currentQuery, citationData, t]);

  const handleSave = useCallback(() => {
    if (!currentQuery) return;
    const willSave = !currentQuery.is_saved;
    toggleSaveQuery(currentQuery.id);
    toast.success(willSave ? t.common.savedQuery : t.common.unsavedQuery);
  }, [currentQuery, toggleSaveQuery, t]);

  const handleFeedback = useCallback((type: "up" | "down") => {
    const val = feedback === type ? null : type;
    setFeedback(val);
    if (val && currentQuery) {
      submitFeedback(currentQuery.id, val);
      toast.success(t.common.feedbackThanks);
    }
  }, [feedback, currentQuery, submitFeedback, t]);

  // Saved queries full view
  if (showSavedQueriesView) {
    return <SavedQueriesView onClose={() => setShowSavedQueries(false)} />;
  }

  // Progressive loading state
  if (queryLoading) {
    return <ProgressiveLoader phase={loadingPhase} />;
  }

  // Source browsing view
  if (selectedSource) {
    return <SourceBrowser />;
  }

  // Error state with dismiss and retry
  if (queryError) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="size-12 text-brand mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">{t.answer.analysisFailed}</h3>
          <p className="text-sm text-muted-foreground mb-6">{queryError}</p>
          <div className="flex items-center justify-center gap-3">
            {currentQuery?.query_text && (
              <button
                onClick={() => { clearError(); submitQuery(currentQuery.query_text); }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--brand)] text-white rounded hover:bg-[var(--brand-hover)] transition-colors"
              >
                <RefreshCw className="size-4" />
                <span>{t.answer.retryQuery}</span>
              </button>
            )}
            <button
              onClick={goHome}
              className="flex items-center gap-2 px-4 py-2 border-2 border-foreground bg-transparent hover:bg-foreground hover:text-background rounded transition-colors"
            >
              <Home className="size-4" />
              <span>{t.answer.dismissError}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state -- show overview dashboard
  if (!analysis) {
    return <OverviewDashboard />;
  }

  const activeSourceCount = sources.filter((s) => s.article_count > 0).length || sourceNames.length - 1;
  const isSaved = currentQuery?.is_saved ?? false;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
      <div className="max-w-4xl">
        {showMethodology && (
          <MethodologyModal onClose={() => setShowMethodology(false)} sourceCount={activeSourceCount} />
        )}

        {/* Analysis content */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4 gap-2">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wide">{t.answer.analysis}</h2>
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
              <FeedbackBar
                feedback={feedback}
                onFeedback={handleFeedback}
                copied={copied}
                onCopy={handleCopy}
                isSaved={isSaved}
                onSave={handleSave}
                showCitationBrackets={showCitationBrackets}
                onToggleCitationBrackets={toggleCitationBrackets}
                t={t}
              />
              <ExportMenu
                isOpen={activeMenu === "export"}
                onToggle={() => setActiveMenu(activeMenu === "export" ? null : "export")}
                onClose={() => setActiveMenu(null)}
                onExport={handleExport}
                t={t}
              />
            </div>
          </div>

          <div className="prose prose-stone prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
            {streamDone ? (
              <CitationContent content={streamedContent} citations={allCitations} showBrackets={showCitationBrackets} />
            ) : (
              <>
                {streamedContent}
                <span className="inline-block w-0.5 h-4 bg-[var(--brand)] animate-pulse ml-0.5 align-text-bottom" />
              </>
            )}
          </div>
        </div>

        {/* Citations -- show after stream is done */}
        {streamDone && citations.length > 0 && (
          <CitationListSection
            citations={citations}
            allCitations={allCitations}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterSource={filterSource}
            setFilterSource={setFilterSource}
            sourceNames={sourceNames}
            activeMenu={activeMenu === "sort" || activeMenu === "filter" ? activeMenu : null}
            setActiveMenu={setActiveMenu}
            t={t}
          />
        )}

        {/* Web search results */}
        {streamDone && <WebSearchResults results={webResults} t={t} />}

        {/* Confidence metadata */}
        {streamDone && analysis && (
          <div className="mt-6 p-3 sm:p-4 bg-accent rounded border-2 border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
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
                  <span className="font-bold text-foreground">{safeFormatDateTime(analysis.created_at)}</span>
                </div>
              </div>
              <button
                onClick={() => setShowMethodology(true)}
                className="text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors self-start sm:self-auto"
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
