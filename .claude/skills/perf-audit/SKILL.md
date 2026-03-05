---
name: perf-audit
description: Audit application performance and bundle size
disable-model-invocation: true
context: fork
agent: Explore
---

# Performance Audit

## Process
1. Analyze bundle size: `cd ET && pnpm build` — check output sizes
2. Check for large dependencies that could be tree-shaken or replaced
3. Review React component patterns:
   - Unnecessary re-renders (missing memo, unstable references)
   - Large component trees without virtualization
   - Expensive computations without useMemo
4. Check image optimization
5. Analyze Tailwind CSS purge — unused styles
6. Review data fetching patterns:
   - Waterfall requests
   - Missing caching
   - Over-fetching
7. Check lazy loading opportunities for routes/components

## Output
Provide a prioritized list of findings:
- **Impact**: High / Medium / Low
- **Effort**: Easy / Medium / Hard
- **Issue**: What's causing the performance problem
- **Fix**: Specific code changes to make
