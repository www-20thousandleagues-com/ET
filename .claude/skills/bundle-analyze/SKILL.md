---
name: bundle-analyze
description: Analyze JavaScript bundle size and find optimization opportunities
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Edit
---

# Bundle Analysis

## Process
1. Build and check output: `cd ET && pnpm build 2>&1`
2. Analyze chunk sizes in build output
3. Install visualizer if needed: `pnpm add -D rollup-plugin-visualizer`
4. Check for:
   - Large dependencies that could be replaced (moment→date-fns, lodash→native)
   - Duplicate packages in bundle
   - Missing tree-shaking (barrel imports pulling entire libraries)
   - Uncompressed asset sizes
   - Dependencies that should be lazy-loaded
5. Recommend optimizations:
   - Dynamic imports for route-level code splitting
   - Replace heavy libraries with lighter alternatives
   - Use `import { specific } from 'lib'` instead of `import lib from 'lib'`
   - Move rarely-used features behind lazy boundaries
   - Externalize large libs if possible (CDN)

## Size Budgets
- Main JS bundle: < 200KB gzipped
- Initial CSS: < 50KB gzipped
- Per-route chunk: < 100KB gzipped
- Total page weight: < 1MB on initial load
