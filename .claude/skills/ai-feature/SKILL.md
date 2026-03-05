---
name: ai-feature
description: Build AI-powered features — chatbot, summarization, classification, generation
argument-hint: <feature-type> (e.g., "chatbot", "content summarizer", "image classifier", "text generator")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# AI Feature

Feature: $ARGUMENTS

## AI Feature Types
### Chatbot/Assistant
- Conversational UI with message history
- Streaming responses for perceived speed
- Context management (system prompt + conversation + RAG)
- Tool/function calling for actions

### Content Generation
- Text generation (articles, descriptions, emails)
- Image generation (DALL-E, Stable Diffusion)
- Code generation with syntax highlighting

### Analysis
- Sentiment analysis
- Text classification/categorization
- Entity extraction
- Summarization
- Translation

## Implementation Pattern
1. Create Supabase Edge Function as AI proxy
2. Handle API key securely server-side
3. Implement streaming for long responses
4. Add rate limiting per user
5. Track usage and costs
6. Cache common queries
7. Add feedback mechanism (thumbs up/down)
8. Build appropriate UI (chat, form, inline)

## Providers
- **Anthropic Claude**: Best for complex reasoning, long context
- **OpenAI GPT**: Broad capabilities, function calling
- **Cohere**: Embeddings, classification, reranking
- **Replicate**: Open-source model hosting
