import { create } from "zustand";
import type { Source } from "@/types/database";
import type { RagQueryResult, RagAnalysis, RagCitation } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { queryRagPipeline, queryWebSearch, type RagResponse } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";

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
  submitQuery: (queryText: string) => Promise<void>;
  submitFeedback: (queryId: string, feedback: "up" | "down") => Promise<void>;

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

  // Reset all state (called on sign-out)
  resetStore: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  sources: [],
  sourcesLoading: false,

  fetchSources: async () => {
    set({ sourcesLoading: true });
    try {
      const { data, error } = await supabase
        .from("sources")
        .select("*")
        .eq("is_active", true)
        .order("name");
      if (error) throw error;
      set({ sources: data ?? [], sourcesLoading: false });
    } catch {
      set({ sources: [], sourcesLoading: false });
    }
  },

  currentQuery: null,
  queryLoading: false,
  queryError: null,

  submitQuery: async (queryText: string) => {
    set({ queryLoading: true, queryError: null, selectedSource: null, sourceArticles: [] });

    const queryId = generateId();

    // Save query to Supabase (must complete before analysis insert)
    const user = useAuthStore.getState().user;
    if (user) {
      await supabase
        .from("queries")
        .insert({ id: queryId, query_text: queryText, user_id: user.id, is_saved: false });
    }

    // Call n8n RAG pipeline + Web Search in parallel
    try {
      const [rag, webSearch] = await Promise.all([
        queryRagPipeline(queryText, queryId),
        queryWebSearch(queryText, queryId).catch(() => null),
      ]);
      const analysis = mapRagResponseToAnalysis(rag);

      const newQuery: RagQueryResult = {
        id: queryId,
        user_id: "",
        query_text: queryText,
        is_saved: false,
        created_at: new Date().toISOString(),
        analysis,
        webResults: webSearch?.web_results ?? [],
      };

      // Update current query and prepend to recent queries
      set((state) => ({
        currentQuery: newQuery,
        queryLoading: false,
        recentQueries: [newQuery, ...state.recentQueries.slice(0, 19)],
      }));

      // Persist analysis + citations to Supabase in background
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
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
          .then(({ data: analysisRow }) => {
            if (!analysisRow) return;
            const citationRows = analysis.citations.map((c) => ({
              analysis_id: analysisRow.id,
              article_id: c.article_id,
              relevance_score: c.relevance_score,
              excerpt: c.excerpt,
              position: c.position,
            }));
            if (citationRows.length > 0) {
              supabase.from("citations").insert(citationRows).then(() => {}).catch(() => {});
            }
          })
          .catch(() => {});
      }
    } catch (err) {
      set({
        queryError: err instanceof Error ? err.message : "Query failed",
        queryLoading: false,
      });
    }
  },

  submitFeedback: async (queryId: string, feedback: "up" | "down") => {
    try {
      const user = useAuthStore.getState().user;
      if (!user) return;
      // Save feedback — update the query's is_saved flag as a proxy
      // (A dedicated feedback table would be better long-term)
      await supabase
        .from("queries")
        .update({ is_saved: feedback === "up" })
        .eq("id", queryId)
        .eq("user_id", user.id);
    } catch {
      // Silently fail — feedback is non-critical
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

  resetStore: () => {
    set({
      sources: [],
      sourcesLoading: false,
      currentQuery: null,
      queryLoading: false,
      queryError: null,
      recentQueries: [],
      recentArticles: [],
      queryCountToday: 0,
      selectedSource: null,
      sourceArticles: [],
      sourceArticlesLoading: false,
      showAllSources: false,
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
