import type { StateCreator } from "zustand";
import type { RagQueryResult, RagAnalysis, RagCitation } from "@/types/database";
import { supabase } from "@/lib/supabase";
import { queryRagPipeline, queryWebSearch, type RagResponse } from "@/lib/api";
import { logger } from "@/lib/logger";
import { useAuthStore } from "@/stores/auth";
import { useLocaleStore } from "@/stores/locale";
import { en } from "@/lib/i18n/en";
import { da } from "@/lib/i18n/da";
import type { AppState } from "@/stores/app";
import { MAX_CACHE_SIZE, FETCH_RECENT_QUERIES_LIMIT } from "@/lib/constants";

const localeErrors = { en, da } as const;

function getLocalizedError(key: keyof typeof en.errors, locale: string, replacements?: Record<string, string>): string {
  const lang = locale in localeErrors ? (locale as keyof typeof localeErrors) : "da";
  let msg = localeErrors[lang].errors[key];
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      msg = msg.replace(`{${k}}`, v);
    }
  }
  return msg;
}

const MAX_QUERY_LENGTH = 2000;
const MIN_QUERY_INTERVAL_MS = 2000;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minute cache
let lastQueryTime = 0;

// Streaming loading phases for progressive UX
export type LoadingPhase = "searching" | "analyzing" | "generating" | null;

// In-memory query result cache
const queryCache = new Map<string, { result: RagQueryResult; timestamp: number }>();

/** Normalizes a query string (lowercase, trimmed, collapsed whitespace) for use as a cache key. */
function getCacheKey(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, " ");
}

/** Returns a cached query result if it exists and hasn't expired (5-minute TTL), otherwise null. */
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

/** Stores a query result in the in-memory cache, evicting the oldest entry if cache exceeds MAX_CACHE_SIZE. */
function setCachedResult(query: string, result: RagQueryResult): void {
  const key = getCacheKey(query);
  queryCache.set(key, { result, timestamp: Date.now() });
  // Evict old entries if cache grows too large
  if (queryCache.size > MAX_CACHE_SIZE) {
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

function mapRagResponseToAnalysis(rag: RagResponse): RagAnalysis {
  return {
    id: generateId(),
    query_id: rag.query_id,
    content: rag.analysis.content,
    confidence: rag.analysis.confidence,
    primary_source_count: rag.analysis.primary_source_count,
    supporting_source_count: rag.analysis.supporting_source_count,
    created_at: new Date().toISOString(),
    citations: rag.citations.map(
      (c): RagCitation => ({
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
      }),
    ),
  };
}

export type QuerySlice = {
  // Current query & analysis
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

  // Stats
  queryCountToday: number;
  fetchQueryCountToday: () => Promise<void>;
};

export const createQuerySlice: StateCreator<AppState, [], [], QuerySlice> = (set, get) => ({
  currentQuery: null,
  queryLoading: false,
  queryError: null,
  loadingPhase: null,

  /**
   * Validates input (length + rate limit), checks the in-memory cache, then runs
   * RAG pipeline and web search in parallel. Persists the query and analysis to
   * Supabase, caches the result, and updates the store with progressive loading phases.
   */
  submitQuery: async (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;
    const locale = useLocaleStore.getState().locale;

    if (trimmed.length > MAX_QUERY_LENGTH) {
      set({ queryError: getLocalizedError("maxLength", locale, { max: String(MAX_QUERY_LENGTH) }) });
      return;
    }

    const now = Date.now();
    if (now - lastQueryTime < MIN_QUERY_INTERVAL_MS) {
      set({ queryError: getLocalizedError("rateLimited", locale) });
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
        recentQueries: [
          cached,
          ...state.recentQueries.filter((q) => q.id !== cached.id).slice(0, FETCH_RECENT_QUERIES_LIMIT - 1),
        ],
      }));
      return;
    }

    set({ queryLoading: true, queryError: null, loadingPhase: "searching", selectedSource: null, sourceArticles: [] });

    const queryId = generateId();

    // Save query to Supabase (must complete before analysis insert)
    const user = useAuthStore.getState().user;
    if (user) {
      await supabase.from("queries").insert({ id: queryId, query_text: trimmed, user_id: user.id, is_saved: false });
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
        recentQueries: [newQuery, ...state.recentQueries.slice(0, FETCH_RECENT_QUERIES_LIMIT - 1)],
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
            .single(),
        )
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
              Promise.resolve(supabase.from("citations").insert(citationRows)).catch((e: unknown) =>
                logger.error("Citation insert failed", { error: e instanceof Error ? e.message : String(e) }),
              );
            }
          })
          .catch((e: unknown) =>
            logger.error("Analysis insert failed", { error: e instanceof Error ? e.message : String(e) }),
          );
      }
    } catch (err) {
      set({
        queryError: err instanceof Error ? err.message : "Query failed",
        queryLoading: false,
        loadingPhase: null,
      });
    }
  },

  /** Persists thumbs-up/down feedback to Supabase by toggling is_saved. Fails silently since feedback is non-critical. */
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

  /** Optimistically toggles is_saved in local state, then persists to Supabase. Reverts on failure. */
  toggleSaveQuery: async (queryId: string) => {
    const user = useAuthStore.getState().user;
    if (!user) return;
    // Optimistic update
    set((state) => {
      const updated = state.recentQueries.map((q) => (q.id === queryId ? { ...q, is_saved: !q.is_saved } : q));
      const currentQuery =
        state.currentQuery?.id === queryId
          ? { ...state.currentQuery, is_saved: !state.currentQuery.is_saved }
          : state.currentQuery;
      return { recentQueries: updated, currentQuery };
    });
    try {
      const query = get().recentQueries.find((q) => q.id === queryId);
      await supabase
        .from("queries")
        .update({ is_saved: query?.is_saved ?? false })
        .eq("id", queryId)
        .eq("user_id", user.id);
    } catch {
      // Revert on error
      set((state) => {
        const reverted = state.recentQueries.map((q) => (q.id === queryId ? { ...q, is_saved: !q.is_saved } : q));
        return { recentQueries: reverted };
      });
    }
  },

  recentQueries: [],

  fetchRecentQueries: async () => {
    try {
      const { data } = await supabase
        .from("queries")
        .select(
          `
          *,
          analysis:analyses(
            *,
            citations(
              *,
              article:articles(*, source:sources(*))
            )
          )
        `,
        )
        .order("created_at", { ascending: false })
        .limit(FETCH_RECENT_QUERIES_LIMIT);

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
});
