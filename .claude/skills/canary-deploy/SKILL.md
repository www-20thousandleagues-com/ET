---
name: canary-deploy
description: Set up canary deployment — gradual traffic shifting with automated rollback
argument-hint: <percentage-steps> (e.g., "1% 5% 25% 50% 100%")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Canary Deployment

Steps: $ARGUMENTS

## Strategy
1. Deploy new version alongside current version
2. Route small percentage of traffic to new version (canary)
3. Monitor error rates, latency, and business metrics
4. Gradually increase traffic if metrics are healthy
5. Auto-rollback if error rate exceeds threshold
6. Complete rollout when 100% traffic on new version

## Metrics to Watch
- Error rate (5xx responses)
- Response latency (p50, p95, p99)
- Business metrics (conversion rate, revenue)
- Client-side errors (JavaScript exceptions)
- Database query performance

## Auto-Rollback Triggers
- Error rate > 1% above baseline
- p95 latency > 2x baseline
- Any 500 errors on critical paths
