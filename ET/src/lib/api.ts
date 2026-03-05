const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || "";

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

export async function queryRagPipeline(
  queryText: string,
  queryId: string
): Promise<RagResponse> {
  if (!N8N_WEBHOOK_URL) {
    throw new Error("VITE_N8N_WEBHOOK_URL not configured");
  }

  const res = await fetch(`${N8N_WEBHOOK_URL}/jaegeren-query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query_text: queryText, query_id: queryId }),
  });

  if (!res.ok) {
    throw new Error(`RAG pipeline error: ${res.status}`);
  }

  return res.json();
}
