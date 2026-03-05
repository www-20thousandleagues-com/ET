---
name: schema-validate
description: Create validation schemas for forms, APIs, and data with Zod
argument-hint: <target> (e.g., "user registration form", "product API", "settings config")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Schema Validation

Target: $ARGUMENTS

## Using Zod
```typescript
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  age: z.number().int().min(13).max(120).optional(),
  role: z.enum(['admin', 'editor', 'viewer']),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    notifications: z.boolean().default(true),
  }).optional(),
})

type User = z.infer<typeof userSchema>
```

## Validation Locations
- **Forms**: react-hook-form + zodResolver
- **API Input**: Edge Function request body validation
- **API Output**: Response shape verification
- **Config**: Environment variable validation
- **Database**: Pre-insert validation layer

## Common Patterns
- `.transform()` for data normalization (trim, lowercase)
- `.refine()` for custom validation (password match, date ranges)
- `.superRefine()` for complex cross-field validation
- `.pipe()` for chaining transformations
- Shared schemas between client and server
