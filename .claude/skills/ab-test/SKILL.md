---
name: ab-test
description: Set up A/B testing — experiment creation, variant assignment, metric tracking, analysis
argument-hint: <experiment-name> <variants> (e.g., "new-checkout control,variant-a,variant-b")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# A/B Testing

Experiment: $ARGUMENTS

## Implementation
1. Create experiment definition (name, variants, allocation percentages)
2. User assignment (hash user_id for deterministic bucketing)
3. Variant rendering (conditionally show different UI)
4. Event tracking (track conversions per variant)
5. Analysis (statistical significance calculation)

## Infrastructure
- Feature flag system as the backbone
- Server-side assignment for consistency
- Client-side rendering per assignment
- Analytics events tied to experiment + variant
- Dashboard for monitoring experiment metrics
- Auto-stop when statistical significance reached
