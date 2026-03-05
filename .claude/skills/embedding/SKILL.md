---
name: embedding
description: Generate and manage vector embeddings for semantic search and AI features
argument-hint: <data-type> (e.g., "documents", "user content", "product descriptions")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Vector Embeddings

Data: $ARGUMENTS

## Supabase pgvector Setup
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  metadata jsonb,
  embedding vector(1536),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX ON embeddings USING hnsw (embedding vector_cosine_ops);
```

## Embedding Pipeline
1. Chunk content (500-1000 tokens, 100 token overlap)
2. Generate embeddings via API (OpenAI ada-002, Cohere, or local)
3. Store in pgvector
4. Query with cosine similarity: `1 - (embedding <=> query_embedding)`

## Providers
- **OpenAI text-embedding-3-small**: 1536 dims, $0.02/1M tokens
- **Cohere embed-v3**: 1024 dims, multilingual
- **Voyage AI**: Optimized for code and technical content
