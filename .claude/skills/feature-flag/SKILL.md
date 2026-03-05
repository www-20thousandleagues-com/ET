---
name: feature-flag
description: Implement feature flags for gradual rollouts and A/B testing
argument-hint: <action> (e.g., "setup system", "add flag new-dashboard", "add percentage rollout")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Feature Flags

Action: $ARGUMENTS

## Approaches
### Simple (Database-backed)
- `feature_flags` table: name, enabled, percentage, user_ids, created_at
- Edge Function or client query to check flags
- Cache aggressively (flags change infrequently)

### PostHog Feature Flags
- Built-in with PostHog analytics
- Percentage rollouts, user targeting, multivariate flags

### Custom Implementation
```typescript
// Hook
function useFeatureFlag(flag: string): boolean {
  const { user } = useAuth()
  const { data } = useQuery(['flags', flag], () => checkFlag(flag, user.id))
  return data ?? false
}

// Usage
function Dashboard() {
  const showNewUI = useFeatureFlag('new-dashboard')
  return showNewUI ? <NewDashboard /> : <OldDashboard />
}
```

## Flag Types
- **Boolean**: On/off
- **Percentage**: Gradual rollout (0-100%)
- **User targeting**: Specific users or segments
- **Multivariate**: A/B/C testing with multiple variants
