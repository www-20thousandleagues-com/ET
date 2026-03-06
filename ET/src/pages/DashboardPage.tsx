import { useEffect } from "react";
import { LeftNav } from "@/app/components/LeftNav";
import { SourceStrip } from "@/app/components/SourceStrip";
import { QueryArea } from "@/app/components/QueryArea";
import { AnswerArea } from "@/app/components/AnswerArea";
import { RightSidebar } from "@/app/components/RightSidebar";
import { useAppStore } from "@/stores/app";

export function DashboardPage() {
  const fetchSources = useAppStore((s) => s.fetchSources);
  const fetchRecentArticles = useAppStore((s) => s.fetchRecentArticles);
  const fetchQueryCountToday = useAppStore((s) => s.fetchQueryCountToday);
  const fetchRecentQueries = useAppStore((s) => s.fetchRecentQueries);

  useEffect(() => {
    fetchSources();
    fetchRecentArticles();
    fetchQueryCountToday();
    fetchRecentQueries();
  }, [fetchSources, fetchRecentArticles, fetchQueryCountToday, fetchRecentQueries]);

  return (
    <div className="flex h-screen bg-white dark:bg-stone-950 overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-black dark:focus:bg-stone-950 dark:focus:text-white">
        Skip to main content
      </a>
      <LeftNav />
      <main id="main-content" className="flex-1 flex flex-col min-w-0">
        <SourceStrip />
        <QueryArea />
        <AnswerArea />
      </main>
      <RightSidebar />
    </div>
  );
}
