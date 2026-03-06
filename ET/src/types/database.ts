export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: "analyst" | "editor" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      sources: {
        Row: {
          id: string;
          name: string;
          slug: string;
          url: string;
          feed_url: string | null;
          source_type: "rss" | "api" | "scrape";
          is_active: boolean;
          article_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["sources"]["Row"], "id" | "article_count" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["sources"]["Insert"]>;
      };
      articles: {
        Row: {
          id: string;
          source_id: string;
          title: string;
          url: string;
          content: string;
          excerpt: string | null;
          published_at: string;
          ingested_at: string;
          embedding_id: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["articles"]["Row"], "id" | "ingested_at">;
        Update: Partial<Database["public"]["Tables"]["articles"]["Insert"]>;
      };
      queries: {
        Row: {
          id: string;
          user_id: string;
          query_text: string;
          is_saved: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["queries"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["queries"]["Insert"]>;
      };
      analyses: {
        Row: {
          id: string;
          query_id: string;
          content: string;
          confidence: number;
          primary_source_count: number;
          supporting_source_count: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["analyses"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      citations: {
        Row: {
          id: string;
          analysis_id: string;
          article_id: string;
          relevance_score: number;
          excerpt: string;
          position: number;
        };
        Insert: Omit<Database["public"]["Tables"]["citations"]["Row"], "id">;
        Update: Partial<Database["public"]["Tables"]["citations"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Source = Database["public"]["Tables"]["sources"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Query = Database["public"]["Tables"]["queries"]["Row"];
export type Analysis = Database["public"]["Tables"]["analyses"]["Row"];
export type Citation = Database["public"]["Tables"]["citations"]["Row"];

// Joined types for UI (from Supabase joins)
export type CitationWithArticle = Citation & {
  article: Article & { source: Source };
};

export type AnalysisWithCitations = Analysis & {
  citations: CitationWithArticle[];
};

export type QueryWithAnalysis = Query & {
  analysis: AnalysisWithCitations | null;
};

// RAG pipeline response types (from n8n webhook — not full DB entities)
export type RagCitation = {
  id: string;
  article_id: string;
  relevance_score: number;
  excerpt: string;
  position: number;
  title: string;
  source_name: string;
  source_slug: string;
  published_at: string;
  url: string;
};

export type RagAnalysis = {
  id: string;
  query_id: string;
  content: string;
  confidence: number;
  primary_source_count: number;
  supporting_source_count: number;
  created_at: string;
  citations: RagCitation[];
};

export type WebResult = {
  title: string;
  url: string;
  content: string;
  source: string;
  score: number;
  published_date: string;
};

export type RagQueryResult = {
  id: string;
  user_id: string;
  query_text: string;
  is_saved: boolean;
  created_at: string;
  analysis: RagAnalysis | null;
  webResults?: WebResult[];
};
