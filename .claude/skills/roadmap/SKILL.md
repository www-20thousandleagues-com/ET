---
name: roadmap
description: Create a product/technical roadmap based on goals and priorities
argument-hint: <scope> (e.g., "Q2 2026", "MVP to launch", "v1 to v2 migration")
disable-model-invocation: true
context: fork
agent: Explore
---

# Roadmap

Scope: $ARGUMENTS

## Process
1. Analyze current state of the project (features, tech debt, infrastructure)
2. Identify goals and milestones
3. Group work into phases/milestones
4. Order by dependencies and priority
5. Identify parallel work streams

## Output Format
### Phase 1: [Name] — [Timeline]
**Goal**: [What this phase achieves]
- [ ] Feature/task 1
- [ ] Feature/task 2
**Milestone**: [Deliverable]

### Phase 2: [Name] — [Timeline]
...

### Technical Debt & Infrastructure
- [ ] Item 1
- [ ] Item 2

### Risks & Dependencies
| Risk | Impact | Mitigation |
|------|--------|-----------|
| ... | ... | ... |
