---
name: analytics
description: Set up analytics — event tracking, dashboards, user behavior, metrics
argument-hint: <action> (e.g., "setup PostHog", "add event tracking", "create analytics dashboard")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Analytics

Action: $ARGUMENTS

## Analytics Providers
- **PostHog**: Open-source, self-hostable, feature flags + analytics
- **Plausible**: Privacy-focused, lightweight
- **Mixpanel**: Event-based, funnel analysis
- **Google Analytics 4**: Free, comprehensive
- **Custom**: Supabase tables + Recharts dashboards

## Implementation
1. Install analytics SDK
2. Create analytics wrapper/hook for consistent tracking
3. Track key events:
   - Page views and navigation
   - User actions (clicks, form submissions, searches)
   - Feature usage
   - Errors and exceptions
   - Performance metrics (load time, interaction time)
4. Create dashboards with Recharts for custom metrics
5. Set up conversion funnels
6. Implement A/B test tracking

## Privacy
- Cookie consent banner (GDPR/CCPA)
- Anonymize IP addresses
- Allow users to opt out
- Data retention policies
- Privacy policy updates
