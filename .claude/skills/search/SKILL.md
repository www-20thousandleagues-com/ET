---
name: search
description: Implement search functionality — full-text, fuzzy, filtered, with autocomplete
argument-hint: <type> <target> (e.g., "full-text posts", "fuzzy users", "filtered products")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Search Implementation

Create: $ARGUMENTS

## Approaches
### Supabase Full-Text Search
- Use PostgreSQL `tsvector` and `tsquery`
- Create GIN indexes for performance
- Support ranking, highlighting, language stemming

### Client-Side Search (Small datasets)
- `cmdk` (already installed) for command palette
- Fuse.js for fuzzy matching
- Simple filter/includes for basic lists

### External Search Service
- Algolia, Typesense, Meilisearch for advanced needs

## Search UI Components
- Search input with keyboard shortcut (Cmd+K)
- Autocomplete/typeahead suggestions
- Search results with highlighting
- Filters (category, date range, status)
- Sort options (relevance, date, popularity)
- Recent searches history
- Empty state with suggestions
- Loading state with skeleton
- Debounced input (300ms)
