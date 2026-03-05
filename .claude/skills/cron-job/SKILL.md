---
name: cron-job
description: Create scheduled tasks and cron jobs
argument-hint: <name> <schedule> <task> (e.g., "cleanup-expired 0 2 * * * delete expired sessions")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Cron Job

Create: $ARGUMENTS

## Supabase Cron (pg_cron)
- Use Supabase Dashboard or SQL to create cron jobs
- Runs as PostgreSQL background worker
- Can execute SQL directly or call Edge Functions via `net.http_post`

## Edge Function Cron
- Create Edge Function for the task logic
- Set up Supabase cron to invoke it on schedule
- Or use external cron service (GitHub Actions, Vercel Cron)

## Implementation
1. Define the task function with clear input/output
2. Add idempotency — safe to run multiple times
3. Add timeout handling
4. Add error notification (email/Slack on failure)
5. Add execution logging (start time, duration, result)
6. Test manually before scheduling

## Common Cron Patterns
- `0 * * * *` — Every hour
- `0 0 * * *` — Daily at midnight
- `0 0 * * 0` — Weekly on Sunday
- `0 0 1 * *` — Monthly on the 1st
- `*/5 * * * *` — Every 5 minutes
