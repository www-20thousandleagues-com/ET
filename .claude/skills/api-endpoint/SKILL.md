---
name: api-endpoint
description: Create a new API endpoint or Supabase Edge Function
argument-hint: <method> <path> <description> (e.g., "POST /api/users create user")
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Bash, Grep, Glob
---

# API Endpoint

Create: $ARGUMENTS

## Process
1. Parse the method, path, and purpose from arguments
2. Check existing endpoints for patterns
3. Create the endpoint with:
   - Input validation (Zod or manual)
   - Authentication check
   - Business logic
   - Error handling with proper HTTP status codes
   - TypeScript request/response types
4. For Supabase Edge Functions:
   - Create in `supabase/functions/<name>/`
   - Use Deno runtime conventions
   - Include CORS headers
5. Write integration tests
6. Update API documentation if it exists

## Response Format Standards
- Success: `{ data: T }`
- Error: `{ error: { message: string, code: string } }`
- List: `{ data: T[], count: number, page: number }`
