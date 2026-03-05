---
name: env-sync
description: Sync environment variables across environments and team members
argument-hint: <action> (e.g., "check drift", "sync staging to local", "document all vars")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Write
---

# Environment Sync

Action: $ARGUMENTS

## Process
1. Read .env.example as the source of truth
2. Compare with .env.local for missing/extra variables
3. Compare with deployed environment (Vercel, Supabase)
4. Report drift:
   - Missing locally but in .env.example
   - Present locally but not in .env.example
   - Different between environments

## Tools
- `vercel env ls` — List Vercel env vars
- `supabase secrets list` — List Supabase secrets
- Compare .env files across environments

## Rules
- .env.example is the canonical list of all required variables
- Every variable must have a comment explaining its purpose
- Default values in .env.example should be safe/development values
- Never store production secrets in any committed file
