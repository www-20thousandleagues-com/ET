---
name: cdn-setup
description: Configure CDN for static assets, API caching, and edge delivery
argument-hint: <provider> (e.g., "Cloudflare", "Vercel Edge", "AWS CloudFront")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# CDN Setup

Provider: $ARGUMENTS

## Configuration
1. Static asset caching (JS, CSS, images, fonts) — Cache-Control: max-age=31536000, immutable
2. HTML caching — Cache-Control: no-cache (revalidate on each request)
3. API caching — Vary by Authorization header, short TTL
4. Image transformation at edge (resize, format conversion)
5. Compression (Brotli > Gzip)
6. HTTP/2 and HTTP/3 support
7. Custom cache rules by path pattern

## Vercel (Recommended for this project)
- Automatic edge caching for static assets
- ISR (Incremental Static Regeneration) for dynamic pages
- Edge Functions for personalized content
- Built-in image optimization
- Automatic Brotli compression
