---
name: error-boundary
description: Create error boundaries and error handling infrastructure
argument-hint: <scope> (e.g., "global app", "per-route", "per-component", "API errors")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Error Boundaries

Scope: $ARGUMENTS

## React Error Boundaries
1. Global error boundary wrapping entire app
2. Route-level error boundaries for page isolation
3. Component-level error boundaries for critical widgets

## Error Boundary Component
- Catches render errors in child tree
- Shows fallback UI (not a blank screen)
- Reports error to monitoring (Sentry)
- Offers recovery action (retry, go home, refresh)
- Logs component stack for debugging

## API Error Handling
- Centralized error handler for Supabase/fetch calls
- Typed error responses
- User-friendly error messages (not raw errors)
- Retry logic with exponential backoff
- Offline detection and queuing
- Toast notifications for transient errors
- Full-page error state for critical failures
