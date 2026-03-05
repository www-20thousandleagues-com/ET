---
name: middleware
description: Create middleware for request processing — auth, logging, rate limiting, CORS
argument-hint: <type> (e.g., "auth guard", "rate limiter", "request logger", "CORS")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Middleware

Type: $ARGUMENTS

## Supabase Edge Function Middleware Pattern
```typescript
// Compose middleware functions
const handler = compose(
  corsMiddleware,
  authMiddleware,
  rateLimitMiddleware,
  logMiddleware,
  mainHandler
)
```

## Common Middleware Types
- **Auth**: Verify JWT, extract user, check permissions
- **CORS**: Set Access-Control headers for allowed origins
- **Rate Limit**: Track requests per IP/user, return 429 when exceeded
- **Logging**: Log request method, path, duration, status code
- **Validation**: Validate request body against schema
- **Error Handler**: Catch errors, format consistent error responses
- **Cache**: Set cache headers, check/store cached responses
- **Compression**: Gzip/Brotli response compression
