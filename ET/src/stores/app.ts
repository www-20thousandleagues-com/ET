import { create } from "zustand";
import type { Source, QueryWithAnalysis, CitationWithArticle } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { queryRagPipeline, type RagResponse } from "@/lib/api";

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

type AppState = {
  // Sources
  sources: Source[];
  sourcesLoading: boolean;
  fetchSources: () => Promise<void>;

  // Current query & analysis
  currentQuery: QueryWithAnalysis | null;
  queryLoading: boolean;
  queryError: string | null;
  submitQuery: (queryText: string) => Promise<void>;

  // Query history
  recentQueries: QueryWithAnalysis[];
  fetchRecentQueries: () => Promise<void>;

  // Recent articles (for trending/sidebar)
  recentArticles: RecentArticle[];
  fetchRecentArticles: () => Promise<void>;

  // Stats
  queryCountToday: number;
  fetchQueryCountToday: () => Promise<void>;
};

function mapRagResponseToAnalysis(rag: RagResponse): QueryWithAnalysis["analysis"] {
  return {
    id: generateId(),
    query_id: rag.query_id,
    content: rag.analysis.content,
    confidence: rag.analysis.confidence,
    primary_source_count: rag.analysis.primary_source_count,
    supporting_source_count: rag.analysis.supporting_source_count,
    created_at: new Date().toISOString(),
    citations: rag.citations.map((c) => ({
      id: generateId(),
      analysis_id: "",
      article_id: c.article_id,
      relevance_score: c.relevance_score,
      excerpt: c.excerpt,
      position: c.position,
      article: {
        id: c.article_id,
        source_id: "",
        title: c.title,
        url: c.url,
        content: "",
        excerpt: c.excerpt,
        published_at: c.published_at,
        ingested_at: new Date().toISOString(),
        embedding_id: null,
        source: {
          id: "",
          name: c.source_name,
          slug: c.source_slug,
          url: "",
          feed_url: null,
          source_type: "rss" as const,
          is_active: true,
          article_count: 0,
          created_at: new Date().toISOString(),
        },
      },
    })) as CitationWithArticle[],
  };
}

export const useAppStore = create<AppState>((set, get) => ({
  sources: [],
  sourcesLoading: false,

  fetchSources: async () => {
    set({ sourcesLoading: true });
    try {
      const { data } = await supabase
        .from("sources")
        .select("*")
        .eq("is_active", true)
        .order("name");
      set({ sources: data ?? [], sourcesLoading: false });
    } catch {
      // If Supabase isn't configured yet, use empty state
      set({ sources: [], sourcesLoading: false });
    }
  },

  currentQuery: null,
  queryLoading: false,
  queryError: null,

  submitQuery: async (queryText: string) => {
    set({ queryLoading: true, queryError: null });

    const queryId = generateId();

    // Save to Supabase in background (non-blocking)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from("queries")
          .insert({ query_text: queryText, user_id: user.id, is_saved: false })
          .then(() => {});
      }
    }).catch(() => {});

    // Call n8n RAG pipeline
    try {
      const rag = await queryRagPipeline(queryText, queryId);
      const analysis = mapRagResponseToAnalysis(rag);

      set({
        currentQuery: {
          id: queryId,
          user_id: "",
          query_text: queryText,
          is_saved: false,
          created_at: new Date().toISOString(),
          analysis,
        },
        queryLoading: false,
      });
    } catch (err) {
      set({
        queryError: err instanceof Error ? err.message : "Query failed",
        queryLoading: false,
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
      set({ recentQueries: (data as unknown as QueryWithAnalysis[]) ?? [] });
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
      const articles = (data ?? []).map((a: Record<string, unknown>) => ({
        id: a.id as string,
        title: a.title as string,
        source_name: (a.source as { name: string })?.name ?? "",
        published_at: a.published_at as string,
        url: a.url as string,
      }));
      set({ recentArticles: articles });
    } catch {
      set({ recentArticles: [] });
    }
  },

  queryCountToday: 0,

  fetchQueryCountToday: async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count } = await supabase
        .from("queries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString());
      set({ queryCountToday: count ?? 0 });
    } catch {
      set({ queryCountToday: 0 });
    }
  },
}));
