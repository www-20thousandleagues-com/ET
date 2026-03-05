---
name: env-setup
description: Set up environment configuration — .env files, validation, documentation
argument-hint: <action> (e.g., "create .env template", "add env validation", "document all vars")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Environment Setup

Action: $ARGUMENTS

## .env Structure
```
.env.example      # Template with all vars (committed to git)
.env.local        # Local overrides (gitignored)
.env.development  # Dev defaults
.env.production   # Production values (DO NOT commit secrets)
```

## Env Validation (Zod)
```typescript
const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_URL: z.string().url(),
})
export const env = envSchema.parse(import.meta.env)
```

## Rules
- NEVER commit actual secrets to git
- Prefix client-side vars with `VITE_` (Vite requirement)
- Validate all env vars at app startup
- Document each var in .env.example with comments
- Use different values per environment
- Rotate secrets periodically
