---
name: logging
description: Set up structured logging — client errors, server logs, audit trails
argument-hint: <scope> (e.g., "client error logging", "server request logging", "audit trail")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Logging

Scope: $ARGUMENTS

## Client-Side Logging
- Global error handler (window.onerror, unhandledrejection)
- React Error Boundaries with error reporting
- User action logging for debugging reproduction
- Performance timing logs
- Send to Sentry or custom endpoint

## Server-Side Logging (Edge Functions)
- Structured JSON log format
- Log levels: DEBUG, INFO, WARN, ERROR, FATAL
- Request/response logging with correlation IDs
- Redact sensitive data (passwords, tokens, PII)
- Log to stdout for platform capture (Supabase, Vercel)

## Audit Trail
- Track who did what when (user_id, action, target, timestamp)
- Store in dedicated `audit_logs` table
- Immutable records (never update or delete)
- Query interface for compliance/debugging
