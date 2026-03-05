---
name: cache-strategy
description: Implement caching strategies — browser, CDN, API, database query caching
argument-hint: <layer> <target> (e.g., "api user-profile", "browser static-assets", "query dashboard-stats")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Cache Strategy

Target: $ARGUMENTS

## Cache Layers
1. **Browser Cache**: HTTP headers (Cache-Control, ETag, Last-Modified)
2. **CDN/Edge Cache**: Vercel Edge, Cloudflare cache rules
3. **Application Cache**: In-memory (Map/LRU), React Query/SWR cache
4. **Database Cache**: Materialized views, Redis, computed columns

## Strategies
- **Cache-First**: Static assets, rarely-changing data
- **Network-First**: User-specific data, frequently-changing content
- **Stale-While-Revalidate**: Semi-static content, good for perceived performance
- **Write-Through**: Update cache on write, read from cache
- **Cache-Aside**: Check cache → miss → fetch → store → return

## Implementation
- Set appropriate TTL (time-to-live) for each cache layer
- Implement cache invalidation on data mutation
- Add cache-busting for deployments (content hashing)
- Monitor cache hit rates
- Handle cache stampede (request coalescing)
