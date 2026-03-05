---
name: graphql
description: Set up or extend GraphQL API — schema, resolvers, client queries
argument-hint: <action> (e.g., "setup GraphQL server", "add query users", "add mutation createPost")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# GraphQL

Action: $ARGUMENTS

## Server Setup (Supabase + pg_graphql)
- Supabase includes pg_graphql — auto-generates GraphQL from your schema
- Access at: `{SUPABASE_URL}/graphql/v1`
- Introspection enabled in development

## Client Setup
```bash
pnpm add @apollo/client graphql
# OR
pnpm add urql graphql
```

## Schema Design
- Types mirror database tables
- Connections pattern for pagination (edges/nodes)
- Input types for mutations
- Custom scalars for dates, JSON, UUID
- Subscriptions for real-time data

## Best Practices
- Use fragments for reusable field selections
- Implement DataLoader for N+1 prevention
- Persisted queries for production security
- Schema-first development (define types before resolvers)
- Generate TypeScript types from schema (graphql-codegen)
