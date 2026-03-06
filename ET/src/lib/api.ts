const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";
const WEBHOOK_SECRET = import.meta.env.VITE_WEBHOOK_SECRET || "";

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
  queryId: string
): Promise<RagResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error("VITE_N8N_WEBHOOK_URL not configured");
  }

  const res = await fetch(`${N8N_WEBHOOK_URL}/jaegeren-query`, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify({ query_text: queryText, query_id: queryId }),
  });

  if (!res.ok) {
    throw new Error(`RAG pipeline error: ${res.status}`);
  }

  return res.json();
}

export async function queryWebSearch(
  queryText: string,
  queryId: string
): Promise<WebSearchResponse> {
  if (!N8N_WEBHOOK_URL) {
    return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
  }

  try {
    const res = await fetch(`${N8N_WEBHOOK_URL}/jaegeren-websearch`, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify({ query_text: queryText, query_id: queryId }),
    });

    if (!res.ok) return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
    return res.json();
  } catch {
    return { query_id: queryId, query_text: queryText, web_results: [], result_count: 0 };
  }
}
