import { useEffect } from "react";
import { Menu, BarChart3, X } from "lucide-react";
import { SectionErrorBoundary } from "@/app/components/SectionErrorBoundary";
import { LeftNav } from "@/app/components/LeftNav";
import { SourceStrip } from "@/app/components/SourceStrip";
import { QueryArea } from "@/app/components/QueryArea";
import { AnswerArea } from "@/app/components/AnswerArea";
import { RightSidebar } from "@/app/components/RightSidebar";
import { SettingsModal } from "@/app/components/SettingsModal";
import { useAppStore } from "@/stores/app";
import { useSettingsStore } from "@/stores/settings";
import { useLocaleStore } from "@/stores/locale";
import { buildMarkdownExport, downloadFile } from "@/app/components/answer/ExportMenu";
import {
  useSources,
  useRecentArticles,
  useRecentQueries,
  useQueryCountToday,
  useSystemHealth,
} from "@/hooks/useQueries";

export function DashboardPage() {
  const leftNavOpen = useAppStore((s) => s.leftNavOpen);
  const rightSidebarOpen = useAppStore((s) => s.rightSidebarOpen);
  const toggleLeftNav = useAppStore((s) => s.toggleLeftNav);
  const toggleRightSidebar = useAppStore((s) => s.toggleRightSidebar);
  const closeAllPanels = useAppStore((s) => s.closeAllPanels);
  const goHome = useAppStore((s) => s.goHome);
  const clearError = useAppStore((s) => s.clearError);
  const settingsOpen = useSettingsStore((s) => s.settingsOpen);
  const t = useLocaleStore((s) => s.t);

  // React Query hooks — replace manual fetchX() calls
  const { data: sources } = useSources();
  const { data: recentArticles } = useRecentArticles();
  const { data: recentQueries } = useRecentQueries();
  const { data: queryCountToday } = useQueryCountToday();
  const { data: systemHealth } = useSystemHealth();

  // Sync React Query data back to Zustand store so existing child components
  // that read from useAppStore continue to work without changes.
  useEffect(() => {
    if (sources) useAppStore.setState({ sources, sourcesLoading: false });
  }, [sources]);

  useEffect(() => {
    if (recentArticles) useAppStore.setState({ recentArticles });
  }, [recentArticles]);

  useEffect(() => {
    if (recentQueries) useAppStore.setState({ recentQueries });
  }, [recentQueries]);

  useEffect(() => {
    if (queryCountToday !== undefined) useAppStore.setState({ queryCountToday });
  }, [queryCountToday]);

  useEffect(() => {
    if (systemHealth) {
      useAppStore.setState({
        lastIngestionTime: systemHealth.lastIngestionTime,
        totalArticleCount: systemHealth.totalArticleCount,
      });
    }
  }, [systemHealth]);

  const toggleSaveQuery = useAppStore((s) => s.toggleSaveQuery);
  const currentQuery = useAppStore((s) => s.currentQuery);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearError();
        closeAllPanels();
      }
      // Cmd/Ctrl+S to save current query
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (currentQuery) {
          toggleSaveQuery(currentQuery.id);
        }
      }
      // Cmd/Ctrl+E to export current analysis as markdown
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault();
        if (currentQuery?.analysis) {
          const localeT = useLocaleStore.getState().t;
          const citations = (currentQuery.analysis.citations ?? []).map((c) => ({
            position: c.position,
            title: c.title,
            source: c.source_name,
            url: c.url,
            excerpt: c.excerpt,
          }));
          const md = buildMarkdownExport(currentQuery.query_text, currentQuery.analysis.content, citations, localeT);
          downloadFile(md, `jaegeren-analysis-${Date.now()}.md`, "text/markdown");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearError, closeAllPanels, currentQuery, toggleSaveQuery]);

  return (
    <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black dark:focus:bg-stone-950 dark:focus:text-white"
      >
        {t.common.skipToContent}
      </a>

      {/* Mobile header — z-50 to stay above everything */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 lg:hidden">
        <button
          onClick={toggleLeftNav}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label={leftNavOpen ? t.common.closeMenu : t.common.menu}
        >
          {leftNavOpen ? <X className="size-5 text-foreground" /> : <Menu className="size-5 text-foreground" />}
        </button>
        <button
          onClick={() => {
            closeAllPanels();
            goHome();
          }}
          className="font-bold text-foreground tracking-tight hover:text-[var(--brand)] transition-colors"
        >
          Jaegeren
        </button>
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label={t.common.insights}
        >
          {rightSidebarOpen ? (
            <X className="size-5 text-foreground" />
          ) : (
            <BarChart3 className="size-5 text-foreground" />
          )}
        </button>
      </div>

      {/* Mobile overlay — dims background, z-40 (below header z-50, above content) */}
      {(leftNavOpen || rightSidebarOpen) && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={closeAllPanels} aria-hidden="true" />
      )}

      {/* Left nav — desktop: static in flex flow. Mobile: fixed slide-in at z-45 */}
      <div
        className={`
          fixed top-[3.25rem] bottom-0 left-0 z-[45] w-72 bg-white dark:bg-stone-950
          transform transition-transform duration-200 ease-in-out
          lg:static lg:z-0 lg:w-64 lg:transform-none lg:transition-none
          ${leftNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <SectionErrorBoundary>
          <LeftNav />
        </SectionErrorBoundary>
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 pt-[3.25rem] lg:pt-0">
        <SectionErrorBoundary>
          <SourceStrip />
        </SectionErrorBoundary>
        <SectionErrorBoundary>
          <QueryArea />
        </SectionErrorBoundary>
        <SectionErrorBoundary>
          <AnswerArea />
        </SectionErrorBoundary>
      </main>

      {/* Right sidebar — desktop (xl+): static in flex flow. Smaller: fixed slide-in at z-45 */}
      <div
        className={`
          fixed top-[3.25rem] bottom-0 right-0 z-[45] w-80 bg-white dark:bg-stone-900
          transform transition-transform duration-200 ease-in-out
          xl:static xl:z-0 xl:transform-none xl:transition-none
          ${rightSidebarOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
        `}
      >
        <SectionErrorBoundary>
          <RightSidebar />
        </SectionErrorBoundary>
      </div>

      {/* Settings modal */}
      {settingsOpen && <SettingsModal />}
    </div>
  );
}
