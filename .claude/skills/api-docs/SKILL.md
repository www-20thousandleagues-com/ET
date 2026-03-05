---
name: api-docs
description: Generate API documentation — OpenAPI spec, endpoint reference, examples
argument-hint: [scope] (e.g., "all endpoints", "auth API", "user API")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# API Documentation

Scope: $ARGUMENTS

## Process
1. Scan codebase for all API endpoints (Edge Functions, API routes)
2. For each endpoint, document:
   - Method + Path
   - Description
   - Authentication requirements
   - Request parameters (path, query, body with types)
   - Response schema (success + error cases)
   - Code examples (curl, JavaScript fetch)
3. Generate OpenAPI 3.0 spec (YAML)
4. Group endpoints by resource/domain
5. Add authentication section
6. Add error code reference
7. Add rate limit documentation
