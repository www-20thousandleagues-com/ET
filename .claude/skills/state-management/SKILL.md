---
name: state-management
description: Set up or refactor state management — local, global, server, URL state
argument-hint: <approach> (e.g., "setup Zustand", "add React Query", "URL state", "context refactor")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# State Management

Approach: $ARGUMENTS

## State Categories
1. **Local State**: useState/useReducer — component-specific, ephemeral
2. **Global UI State**: Zustand/Jotai/Context — theme, modals, sidebar open
3. **Server State**: React Query/SWR — API data with caching, refetching
4. **URL State**: Search params — filters, pagination, active tab
5. **Form State**: react-hook-form — form values, validation, submission

## Decision Matrix
| Data Type | Tool | Why |
|-----------|------|-----|
| Component-only | useState | Simplest, no overhead |
| Shared UI state | Zustand | Lightweight, no providers |
| Server data | React Query | Caching, deduplication, refetch |
| URL-persisted | useSearchParams | Shareable, bookmarkable |
| Complex forms | react-hook-form | Performance, validation |

## Rules
- Start with the simplest solution (useState)
- Lift state up only when needed by siblings
- Never duplicate server state in client state
- URL state for anything that should survive page refresh
- Avoid prop drilling beyond 2 levels — use context or store
