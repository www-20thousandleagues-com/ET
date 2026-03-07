import { useEffect } from "react";
import { Menu, BarChart3, X } from "lucide-react";
import { LeftNav } from "@/app/components/LeftNav";
import { SourceStrip } from "@/app/components/SourceStrip";
import { QueryArea } from "@/app/components/QueryArea";
import { AnswerArea } from "@/app/components/AnswerArea";
import { RightSidebar } from "@/app/components/RightSidebar";
import { useAppStore } from "@/stores/app";
import { useLocaleStore } from "@/stores/locale";

export function DashboardPage() {
  const fetchSources = useAppStore((s) => s.fetchSources);
  const fetchRecentArticles = useAppStore((s) => s.fetchRecentArticles);
  const fetchQueryCountToday = useAppStore((s) => s.fetchQueryCountToday);
  const fetchRecentQueries = useAppStore((s) => s.fetchRecentQueries);
  const fetchSystemHealth = useAppStore((s) => s.fetchSystemHealth);
  const leftNavOpen = useAppStore((s) => s.leftNavOpen);
  const rightSidebarOpen = useAppStore((s) => s.rightSidebarOpen);
  const toggleLeftNav = useAppStore((s) => s.toggleLeftNav);
  const toggleRightSidebar = useAppStore((s) => s.toggleRightSidebar);
  const closeAllPanels = useAppStore((s) => s.closeAllPanels);
  const t = useLocaleStore((s) => s.t);

  useEffect(() => {
    fetchSources();
    fetchRecentArticles();
    fetchQueryCountToday();
    fetchRecentQueries();
    fetchSystemHealth();
  }, [fetchSources, fetchRecentArticles, fetchQueryCountToday, fetchRecentQueries, fetchSystemHealth]);

  return (
    <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black dark:focus:bg-stone-950 dark:focus:text-white">
        {t.common.skipToContent}
      </a>

      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 lg:hidden">
        <button
          onClick={toggleLeftNav}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label={leftNavOpen ? t.common.closeMenu : t.common.menu}
        >
          {leftNavOpen ? <X className="size-5 text-foreground" /> : <Menu className="size-5 text-foreground" />}
        </button>
        <h1 className="font-bold text-foreground tracking-tight">Jaegeren</h1>
        <button
          onClick={toggleRightSidebar}
          className="p-2 rounded hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label={t.common.insights}
        >
          {rightSidebarOpen ? <X className="size-5 text-foreground" /> : <BarChart3 className="size-5 text-foreground" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {(leftNavOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={closeAllPanels}
        />
      )}

      {/* Left nav — always visible on desktop, slide-in on mobile */}
      <div className={`
        fixed inset-y-0 left-0 z-20 w-72 transform transition-transform duration-200 ease-in-out
        lg:relative lg:translate-x-0 lg:w-64 lg:z-0
        ${leftNavOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <LeftNav />
      </div>

      {/* Main content */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        <SourceStrip />
        <QueryArea />
        <AnswerArea />
      </main>

      {/* Right sidebar — always visible on xl+, slide-in on smaller */}
      <div className={`
        fixed inset-y-0 right-0 z-20 w-80 transform transition-transform duration-200 ease-in-out
        xl:relative xl:translate-x-0 xl:z-0
        ${rightSidebarOpen ? "translate-x-0" : "translate-x-full xl:translate-x-0"}
      `}>
        <RightSidebar />
      </div>
    </div>
  );
}
