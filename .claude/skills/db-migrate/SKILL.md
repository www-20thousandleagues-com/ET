---
name: db-migrate
description: Create and run database migrations via Supabase
argument-hint: <description> (e.g., "add user_profiles table")
disable-model-invocation: true
allowed-tools: Read, Write, Bash, Grep, Glob
---

# Database Migration

Migration: $ARGUMENTS

## Process
1. Understand the required schema change
2. Check existing migrations for patterns and naming conventions
3. Generate migration SQL with:
   - Forward migration (up)
   - Rollback migration (down)
4. Apply RLS policies for new tables
5. Create TypeScript types matching the new schema
6. Run migration via Supabase CLI or MCP
7. Verify migration applied correctly
8. Update any affected queries/hooks in the codebase

## Rules
- Always include RLS policies
- Use snake_case for database columns
- Add indexes for frequently queried columns
- Include created_at and updated_at timestamps
- Never drop columns in production without a deprecation period
