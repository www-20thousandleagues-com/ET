import { create } from "zustand";
import type { Source } from "@/types/database";
import type { RagQueryResult, RagAnalysis, RagCitation } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { queryRagPipeline, queryWebSearch, type RagResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useLocaleStore } from "@/stores/locale";

const MAX_QUERY_LENGTH = 2000;
const MIN_QUERY_INTERVAL_MS = 2000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache
let lastQueryTime = 0;

// Streaming loading phases for progressive UX
export type LoadingPhase = "searching" | "analyzing" | "generating" | null;

// In-memory query result cache
const queryCache = new Map<string, { result: RagQueryResult; timestamp: number }>();

function getCacheKey(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, " ");
}

function getCachedResult(query: string): RagQueryResult | null {
  const key = getCacheKey(query);
  const entry = queryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    queryCache.delete(key);
    return null;
  }
  return entry.result;
}

function setCachedResult(query: string, result: RagQueryResult): void {
  const key = getCacheKey(query);
  queryCache.set(key, { result, timestamp: Date.now() });
  // Evict old entries if cache grows too large
  if (queryCache.size > 50) {
    const oldest = queryCache.keys().next().value;
    if (oldest) queryCache.delete(oldest);
  }
}

// crypto.randomUUID() requires secure context (HTTPS). Fallback for HTTP.
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

type RecentArticle = {
  id: string;
  title: string;
  source_name: string;
  published_at: string;
  url: string;
};

function mapArticleRow(a: Record<string, unknown>): RecentArticle {
  return {
    id: a.id as string,
    title: a.title as string,
    source_name: (a.source as { name: string } | null)?.name ?? "",
    published_at: a.published_at as string,
    url: a.url as string,
  };
}

function mapRagResponseToAnalysis(rag: RagResponse): RagAnalysis {
  return {
    id: generateId(),
    query_id: rag.query_id,
    content: rag.analysis.content,
    confidence: rag.analysis.confidence,
    primary_source_count: rag.analysis.primary_source_count,
    supporting_source_count: rag.analysis.supporting_source_count,
    created_at: new Date().toISOString(),
    citations: rag.citations.map((c): RagCitation => ({
      id: generateId(),
      article_id: c.article_id,
      relevance_score: c.relevance_score,
      excerpt: c.excerpt,
      position: c.position,
      title: c.title,
      source_name: c.source_name,
      source_slug: c.source_slug,
      published_at: c.published_at,
      url: c.url,
    })),
  };
}

type AppState = {
  // Sources
  sources: Source[];
  sourcesLoading: boolean;
  fetchSources: () => Promise<void>;

  // Current query & analysis (uses RAG-specific types, not DB entity types)
  currentQuery: RagQueryResult | null;
  queryLoading: boolean;
  queryError: string | null;
  loadingPhase: LoadingPhase;
  submitQuery: (queryText: string) => Promise<void>;
  submitFeedback: (queryId: string, feedback: "up" | "down") => Promise<void>;

  // Saved queries
  toggleSaveQuery: (queryId: string) => Promise<void>;

  // Query history
  recentQueries: RagQueryResult[];
  fetchRecentQueries: () => Promise<void>;

  // Recent articles (for trending/sidebar)
  recentArticles: RecentArticle[];
  fetchRecentArticles: () => Promise<void>;

  // Stats
  queryCountToday: number;
  fetchQueryCountToday: () => Promise<void>;

  // Source browsing
  selectedSource: Source | null;
  sourceArticles: RecentArticle[];
  sourceArticlesLoading: boolean;
  browseSource: (source: Source) => Promise<void>;
  clearSelectedSource: () => void;
  showAllSources: boolean;
  toggleShowAllSources: () => void;

  // Mobile layout
  leftNavOpen: boolean;
  rightSidebarOpen: boolean;
  toggleLeftNav: () => void;
  toggleRightSidebar: () => void;
  closeAllPanels: () => void;

  // Monitoring
  lastIngestionTime: string | null;
  totalArticleCount: number;
  fetchSystemHealth: () => Promise<void>;

  // Reset all state (called on sign-out)
  resetStore: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  sources: [],
  sourcesLoading: false,

  fetchSources: async () => {
    set({ sourcesLoading: true });
    try {
      const { data, error } = await supabase
        .from("sources")
        .select("*, articles(count)")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      // Replace static article_count with live count from articles join
      const sources = (data ?? []).map((row: Record<string, unknown>) => {
        const articlesArr = row.articles as { count: number }[] | undefined;
        const liveCount = articlesArr?.[0]?.count ?? 0;
        return { ...row, article_count: liveCount } as Source;
      });
      set({ sources, sourcesLoading: false });
    } catch {
      set({ sources: [], sourcesLoading: false });
    }
  },

  currentQuery: null,
  queryLoading: false,
  queryError: null,
  loadingPhase: null,

  submitQuery: async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_QUERY_LENGTH) {
      set({ queryError: `Max ${MAX_QUERY_LENGTH} tegn` });
      return;
    }

    const now = Date.now();
    if (now - lastQueryTime < MIN_QUERY_INTERVAL_MS) {
      set({ queryError: "Vent venligst et oejeblik" });
      return;
    }
    lastQueryTime = now;

    // Check cache first
    const cached = getCachedResult(trimmed);
    if (cached) {
      set((state) => ({
        currentQuery: cached,
        queryLoading: false,
        queryError: null,
        selectedSource: null,
        sourceArticles: [],
        recentQueries: [cached, ...state.recentQueries.filter((q) => q.id !== cached.id).slice(0, 19)],
      }));
      return;
    }

    set({ queryLoading: true, queryError: null, loadingPhase: "searching", selectedSource: null, sourceArticles: [] });

    const queryId = generateId();

    // Save query to Supabase (must complete before analysis insert)
    const user = useAuthStore.getState().user;
    if (user) {
      await supabase
        .from("queries")
        .insert({ id: queryId, query_text: trimmed, user_id: user.id, is_saved: false });
    }

    // Call n8n RAG pipeline + Web Search in parallel
    try {
      set({ loadingPhase: "analyzing" });
      const locale = useLocaleStore.getState().locale;
      const [rag, webSearch] = await Promise.all([
        queryRagPipeline(trimmed, queryId, locale),
        queryWebSearch(trimmed, queryId).catch(() => null),
      ]);
      set({ loadingPhase: "generating" });
      const analysis = mapRagResponseToAnalysis(rag);

      const newQuery: RagQueryResult = {
        id: queryId,
        user_id: useAuthStore.getState().user?.id ?? "",
        query_text: trimmed,
        is_saved: false,
        created_at: new Date().toISOString(),
        analysis,
        webResults: webSearch?.web_results ?? [],
      };

      // Cache the result for fast re-queries
      setCachedResult(trimmed, newQuery);

      // Update current query and prepend to recent queries
      set((state) => ({
        currentQuery: newQuery,
        queryLoading: false,
        loadingPhase: null,
        recentQueries: [newQuery, ...state.recentQueries.slice(0, 19)],
      }));

      // Persist analysis + citations to Supabase in background
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        Promise.resolve(
          supabase
            .from("analyses")
            .insert({
              query_id: queryId,
              content: analysis.content,
              confidence: analysis.confidence,
              primary_source_count: analysis.primary_source_count,
              supporting_source_count: analysis.supporting_source_count,
            })
            .select("id")
            .single()
        ).then(({ data: analysisRow }) => {
            if (!analysisRow) return;
            const citationRows = analysis.citations.map((c) => ({
              analysis_id: analysisRow.id,
              article_id: c.article_id,
              relevance_score: c.relevance_score,
              excerpt: c.excerpt,
              position: c.position,
            }));
            if (citationRows.length > 0) {
              Promise.resolve(supabase.from("citations").insert(citationRows)).catch((e: unknown) => console.error("Citation insert failed:", e));
            }
          })
          .catch((e: unknown) => console.error("Analysis insert failed:", e));
      }
    } catch (err) {
      set({
        queryError: err instanceof Error ? err.message : "Query failed",
        queryLoading: false,
        loadingPhase: null,
      });
    }
  },

  submitFeedback: async (queryId: string, feedback: "up" | "down") => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;
      await supabase
        .from("queries")
        .update({ is_saved: feedback === "up" })
        .eq("id", queryId)
        .eq("user_id", user.id);
    } catch {
      // Silently fail — feedback is non-critical
    }
  },

  toggleSaveQuery: async (queryId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    // Optimistic update
    set((state) => {
      const updated = state.recentQueries.map((q) =>
        q.id === queryId ? { ...q, is_saved: !q.is_saved } : q
      );
      const currentQuery = state.currentQuery?.id === queryId
        ? { ...state.currentQuery, is_saved: !state.currentQuery.is_saved }
        : state.currentQuery;
      return { recentQueries: updated, currentQuery };
    });
    try {
      const query = useAppStore.getState().recentQueries.find((q) => q.id === queryId);
      await supabase
        .from("queries")
        .update({ is_saved: query?.is_saved ?? false })
        .eq("id", queryId)
        .eq("user_id", user.id);
    } catch {
      // Revert on error
      set((state) => {
        const reverted = state.recentQueries.map((q) =>
          q.id === queryId ? { ...q, is_saved: !q.is_saved } : q
        );
        return { recentQueries: reverted };
      });
    }
  },

  recentQueries: [],

  fetchRecentQueries: async () => {
    try {
      const { data } = await supabase
        .from("queries")
        .select(`
          *,
          analysis:analyses(
            *,
            citations(
              *,
              article:articles(*, source:sources(*))
            )
          )
        `)
        .order("created_at", { ascending: false })
        .limit(20);

      // Supabase returns `analysis` as an array (1:many join). Extract first item.
      const mapped: RagQueryResult[] = (data ?? []).map((row: Record<string, unknown>) => {
        const analysisArr = row.analysis as Record<string, unknown>[] | null;
        const a = analysisArr?.[0];
        let analysis: RagAnalysis | null = null;

        if (a) {
          const citationsArr = (a.citations as Record<string, unknown>[]) ?? [];
          analysis = {
            id: a.id as string,
            query_id: a.query_id as string,
            content: a.content as string,
            confidence: a.confidence as number,
            primary_source_count: a.primary_source_count as number,
            supporting_source_count: a.supporting_source_count as number,
            created_at: a.created_at as string,
            citations: citationsArr.map((c: Record<string, unknown>): RagCitation => {
              const article = c.article as Record<string, unknown> | null;
              const source = article?.source as Record<string, unknown> | null;
              return {
                id: c.id as string,
                article_id: c.article_id as string,
                relevance_score: c.relevance_score as number,
                excerpt: c.excerpt as string,
                position: c.position as number,
                title: (article?.title as string) ?? "",
                source_name: (source?.name as string) ?? "",
                source_slug: (source?.slug as string) ?? "",
                published_at: (article?.published_at as string) ?? "",
                url: (article?.url as string) ?? "",
              };
            }),
          };
        }

        return {
          id: row.id as string,
          user_id: row.user_id as string,
          query_text: row.query_text as string,
          is_saved: row.is_saved as boolean,
          created_at: row.created_at as string,
          analysis,
        };
      });

      set({ recentQueries: mapped });
    } catch {
      set({ recentQueries: [] });
    }
  },

  recentArticles: [],

  fetchRecentArticles: async () => {
    try {
      const { data } = await supabase
        .from("articles")
        .select("id, title, published_at, url, source:sources(name)")
        .order("published_at", { ascending: false })
        .limit(20);
      set({ recentArticles: (data ?? []).map((a: Record<string, unknown>) => mapArticleRow(a)) });
    } catch {
      set({ recentArticles: [] });
    }
  },

  selectedSource: null,
  sourceArticles: [],
  sourceArticlesLoading: false,

  browseSource: async (source: Source) => {
    set({ selectedSource: source, sourceArticlesLoading: true, currentQuery: null, queryError: null });
    try {
      const { data } = await supabase
        .from("articles")
        .select("id, title, published_at, url, source:sources(name)")
        .eq("source_id", source.id)
        .order("published_at", { ascending: false })
        .limit(50);
      set({
        sourceArticles: (data ?? []).map((a: Record<string, unknown>) => mapArticleRow(a)),
        sourceArticlesLoading: false,
      });
    } catch {
      set({ sourceArticles: [], sourceArticlesLoading: false });
    }
  },

  clearSelectedSource: () => {
    set({ selectedSource: null, sourceArticles: [] });
  },

  showAllSources: false,

  toggleShowAllSources: () => {
    set((state) => ({ showAllSources: !state.showAllSources }));
  },

  // Mobile layout
  leftNavOpen: false,
  rightSidebarOpen: false,

  toggleLeftNav: () => {
    set((state) => ({ leftNavOpen: !state.leftNavOpen, rightSidebarOpen: false }));
  },

  toggleRightSidebar: () => {
    set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen, leftNavOpen: false }));
  },

  closeAllPanels: () => {
    set({ leftNavOpen: false, rightSidebarOpen: false });
  },

  // Monitoring
  lastIngestionTime: null,
  totalArticleCount: 0,

  fetchSystemHealth: async () => {
    try {
      const { data } = await supabase
        .from("articles")
        .select("ingested_at")
        .order("ingested_at", { ascending: false })
        .limit(1);
      const latest = data?.[0]?.ingested_at ?? null;

      const { count } = await supabase
        .from("articles")
        .select("*", { count: "exact", head: true });

      set({ lastIngestionTime: latest, totalArticleCount: count ?? 0 });
    } catch {
      // Non-critical
    }
  },

  resetStore: () => {
    set({
      sources: [],
      sourcesLoading: false,
      currentQuery: null,
      queryLoading: false,
      queryError: null,
      loadingPhase: null,
      recentQueries: [],
      recentArticles: [],
      queryCountToday: 0,
      selectedSource: null,
      sourceArticles: [],
      sourceArticlesLoading: false,
      showAllSources: false,
      leftNavOpen: false,
      rightSidebarOpen: false,
      lastIngestionTime: null,
      totalArticleCount: 0,
    });
  },

  queryCountToday: 0,

  fetchQueryCountToday: async () => {
    try {
      // Use UTC midnight for consistent server-side filtering
      const now = new Date();
      const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      const user = useAuthStore.getState().user;
      let query = supabase
        .from("queries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayUTC.toISOString());

      if (user) {
        query = query.eq("user_id", user.id);
      }

      const { count, error } = await query;
      if (error) throw error;
      set({ queryCountToday: count ?? 0 });
    } catch {
      set({ queryCountToday: 0 });
    }
  },
}));
