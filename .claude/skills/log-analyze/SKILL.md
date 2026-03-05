---
name: log-analyze
description: Analyze application logs, error traces, and debug output
argument-hint: <log-source> (e.g., "build output", "console errors", "sentry")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash
---

# Log Analysis

Source: $ARGUMENTS

## Process
1. Collect and read the logs from the specified source
2. Parse and categorize entries:
   - **Errors** — Stack traces, exceptions, fatal issues
   - **Warnings** — Deprecations, potential issues
   - **Performance** — Slow operations, timeouts
   - **Patterns** — Recurring issues, frequency analysis
3. For each significant finding:
   - Trace to source code location
   - Identify root cause
   - Propose fix
4. Summarize findings with priority ranking

## Log Sources
- Build output: `cd ET && pnpm build 2>&1`
- TypeScript: `cd ET && npx tsc --noEmit 2>&1`
- Runtime console: Browser DevTools or test output
- Sentry: Use Sentry MCP to query errors
- Supabase: Check Edge Function logs
