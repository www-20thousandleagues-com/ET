---
name: serverless
description: Create serverless functions — Supabase Edge Functions, Vercel Functions, AWS Lambda
argument-hint: <function-name> <purpose> (e.g., "process-image resize uploaded images")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Serverless Function

Create: $ARGUMENTS

## Supabase Edge Functions (Deno Runtime)
```bash
supabase functions new <function-name>
```

### Structure
```
supabase/functions/<name>/
├── index.ts    # Main handler
└── _shared/    # Shared utilities
```

### Template
```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { data } = await req.json()
    // Business logic here
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
```

## Deployment
- `supabase functions deploy <name>`
- Environment secrets: `supabase secrets set KEY=VALUE`
- Test locally: `supabase functions serve`
