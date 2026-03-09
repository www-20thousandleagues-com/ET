import { logger } from "@/lib/logger";
import { en } from "@/lib/i18n/en";
import { da } from "@/lib/i18n/da";

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET || "";

const errorTranslations = { en, da } as const;

type ErrorKey = keyof typeof en.errors;

function getErrorMessage(key: ErrorKey, locale: string): string {
  const lang = locale in errorTranslations ? (locale as keyof typeof errorTranslations) : "da";
  return errorTranslations[lang].errors[key];
}

if (!N8N_WEBHOOK_URL && import.meta.env.MODE === "production") {
  logger.warn("VITE_N8N_WEBHOOK_URL is not set — RAG queries will fail");
}

export type RagResponse = {
  query_id: string;
  analysis: {
    content: string;
    confidence: number;
    primary_source_count: number;
    supporting_source_count: number;
  };
  citations: {
    article_id: string;
    title: string;
    source_name: string;
    source_slug: string;
    published_at: string;
    url: string;
    excerpt: string;
    relevance_score: number;
    position: number;
  }[];
};

export type WebSearchResult = {
  title: string;
  url: string;
  content: string;
  source: string;
  score: number;
  published_date: string;
};

export type WebSearchResponse = {
  query_id: string;
  query_text: string;
  web_results: WebSearchResult[];
  result_count: number;
};

function buildHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (WEBHOOK_SECRET) {
    headers["x-webhook-secret"] = WEBHOOK_SECRET;
  }
  return headers;
}

export async function queryRagPipeline(
  queryText: string,
  queryId: string,
  locale: string = "da",
): Promise<RagResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error(getErrorMessage("webhookNotConfigured", locale));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${N8N_WEBHOOK_URL}/jaegeren-query`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ query_text: queryText, query_id: queryId, locale }),
      signal: controller.signal,
      keepalive: true,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(getErrorMessage("ragPipelineError", locale));
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      throw new Error(getErrorMessage("invalidResponse", locale));
    }

    if (!data || typeof (data as RagResponse).analysis?.content !== "string") {
      throw new Error("Invalid RAG response structure");
    }
    return data as RagResponse;
  } catch (e) {
    clearTimeout(timeout);
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error(getErrorMessage("timeout", locale), { cause: e });
    }
    throw e;
  }
}

export async function queryWebSearch(queryText: string, queryId: string): Promise<WebSearchResponse> {
  if (!N8N_WEBHOOK_URL) {
    return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const res = await fetch(`${N8N_WEBHOOK_URL}/jaegeren-websearch`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ query_text: queryText, query_id: queryId }),
      signal: controller.signal,
      keepalive: true,
    });

    clearTimeout(timeout);

    if (!res.ok) return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      logger.error("Web search returned invalid JSON");
      return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
    }

    return data as WebSearchResponse;
  } catch (e) {
    logger.error("Web search failed", { error: e instanceof Error ? e.message : String(e) });
    return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
  }
}
