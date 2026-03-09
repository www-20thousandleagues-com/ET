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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearError();
        closeAllPanels();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearError, closeAllPanels]);

  return (
    <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black dark:focus:bg-stone-950 dark:focus:text-white"
      >
        {t.common.skipToContent}
      </a>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 lg:hidden">
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

      {/* Mobile overlay */}
      {(leftNavOpen || rightSidebarOpen) && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={closeAllPanels} />
      )}

      {/* Left nav — always visible on desktop, slide-in on mobile */}
      <div
        className={`
        fixed top-14 bottom-0 left-0 z-30 w-72 transform transition-transform duration-200 ease-in-out
        lg:relative lg:top-0 lg:translate-x-0 lg:w-64 lg:z-0
        ${leftNavOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <SectionErrorBoundary>
          <LeftNav />
        </SectionErrorBoundary>
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
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

      {/* Right sidebar — always visible on xl+, slide-in on smaller */}
      <div
        className={`
        fixed top-14 bottom-0 right-0 z-30 w-80 transform transition-transform duration-200 ease-in-out
        xl:relative xl:top-0 xl:translate-x-0 xl:z-0
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
