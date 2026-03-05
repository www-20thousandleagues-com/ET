---
name: rag-pipeline
description: Build Retrieval-Augmented Generation pipeline — embeddings, vector search, LLM
argument-hint: <data-source> (e.g., "documentation", "user content", "product catalog")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# RAG Pipeline

Data Source: $ARGUMENTS

## Architecture
1. **Ingest**: Load documents → chunk → generate embeddings → store
2. **Retrieve**: Query → embed → vector similarity search → top-k results
3. **Generate**: Context + query → LLM → answer with citations

## Supabase pgvector Setup
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  metadata jsonb,
  embedding vector(1536)  -- OpenAI ada-002 dimension
);

CREATE INDEX ON documents USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

## Implementation
1. Document chunking (500-1000 tokens per chunk, 100 token overlap)
2. Embedding generation (OpenAI, Cohere, or local model)
3. Vector storage in Supabase with pgvector
4. Similarity search function (cosine distance)
5. Context assembly (top 5-10 relevant chunks)
6. LLM prompt with context + user query
7. Response with source citations
8. Feedback loop for quality improvement
