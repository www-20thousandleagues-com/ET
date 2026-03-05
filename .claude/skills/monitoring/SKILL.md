---
name: monitoring
description: Set up application monitoring — uptime, errors, performance, alerts
argument-hint: <type> (e.g., "setup Sentry", "add health checks", "create status page")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Monitoring

Type: $ARGUMENTS

## Error Monitoring (Sentry)
1. Install: `@sentry/react`
2. Initialize in main.tsx with DSN
3. Configure: source maps, release tracking, environment tags
4. Set up error boundaries for React components
5. Add custom breadcrumbs for user actions
6. Configure alerting rules

## Uptime Monitoring
- Health check endpoint: `/api/health`
- Response: `{ status: "ok", version, timestamp, dependencies: {} }`
- External monitoring: UptimeRobot, Pingdom, BetterStack

## Performance Monitoring
- Core Web Vitals tracking (LCP, FID, CLS)
- API response time tracking
- Database query performance
- Bundle size tracking per commit

## Alerting
- Error rate spikes → Immediate notification
- Uptime failures → PagerDuty/Slack/Email
- Performance degradation → Warning alerts
- Deployment events → Info notifications
