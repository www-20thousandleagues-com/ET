---
name: sprint-plan
description: Plan a development sprint — prioritize, assign, estimate, define goals
argument-hint: <goals-or-issues> (e.g., "launch MVP", "fix critical bugs", "add user profiles")
disable-model-invocation: true
context: fork
agent: Explore
---

# Sprint Planning

Goals: $ARGUMENTS

## Process
1. List all candidate tasks/issues
2. Prioritize using MoSCoW (Must/Should/Could/Won't)
3. Estimate each task
4. Define sprint goal (one sentence)
5. Allocate tasks within capacity
6. Identify dependencies and ordering
7. Define "done" criteria for each task

## Output
### Sprint Goal
[One clear sentence]

### Sprint Backlog
| Priority | Task | Estimate | Depends On | Done When |
|----------|------|----------|-----------|-----------|
| Must | ... | S | - | ... |
| Should | ... | M | Task 1 | ... |

### Risks & Mitigations
- [Risk]: [Mitigation]

### Definition of Done (Sprint)
- All "Must" items completed
- Build passes, no regressions
- Code reviewed
- Deployed to staging
