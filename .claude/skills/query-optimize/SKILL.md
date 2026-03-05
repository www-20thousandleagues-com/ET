---
name: query-optimize
description: Optimize database queries — indexes, query plans, N+1 fixes
argument-hint: <query-or-table> (e.g., "users with posts query", "dashboard aggregations", "slow endpoints")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Query Optimization

Target: $ARGUMENTS

## Analysis Process
1. Identify slow queries (Supabase Dashboard → SQL Editor → EXPLAIN ANALYZE)
2. Check for:
   - Missing indexes on WHERE/JOIN/ORDER BY columns
   - N+1 query patterns (loop of individual queries)
   - Full table scans on large tables
   - Unnecessary columns selected (SELECT *)
   - Missing pagination on large result sets
   - Suboptimal JOIN ordering
3. Apply optimizations:
   - Add targeted indexes (B-tree, GIN, GiST)
   - Replace N+1 with JOINs or batch queries
   - Add pagination with cursor-based approach
   - Use materialized views for expensive aggregations
   - Add partial indexes for filtered queries
   - Use database functions for complex operations
4. Verify improvement with EXPLAIN ANALYZE before/after
5. Monitor query performance over time
