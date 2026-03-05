---
name: profile
description: Profile application performance — identify bottlenecks and optimize
argument-hint: [area] (e.g., "bundle size", "render performance", "api latency")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Performance Profile

Focus: $ARGUMENTS

## Bundle Analysis
1. Build with analysis: `cd ET && pnpm build 2>&1` — check chunk sizes
2. Identify largest dependencies by checking package.json
3. Find dynamic import opportunities
4. Check for duplicate dependencies in node_modules

## Render Performance
1. Find components that re-render unnecessarily
2. Check for missing `React.memo`, `useMemo`, `useCallback`
3. Find expensive computations in render paths
4. Check for large lists without virtualization
5. Identify layout thrashing patterns

## Network Performance
1. Check for waterfall requests (sequential instead of parallel)
2. Find missing data caching/deduplication
3. Check payload sizes
4. Identify over-fetching (loading more data than displayed)

## Optimization Actions
- Replace heavy libraries with lighter alternatives
- Add code splitting at route boundaries
- Implement virtual scrolling for large lists
- Add proper caching headers and strategies
- Optimize images (WebP, lazy loading, srcset)
