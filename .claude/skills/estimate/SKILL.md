---
name: estimate
description: Estimate effort and complexity for a feature or task
argument-hint: <feature-description>
disable-model-invocation: true
context: fork
agent: Explore
---

# Effort Estimation

Feature: $ARGUMENTS

## Process
1. Break down into subtasks
2. For each subtask, assess:
   - **Complexity**: Simple / Medium / Complex
   - **Risk**: Low / Medium / High (unknowns, integrations, new tech)
   - **Dependencies**: What must exist first
   - **Files affected**: Which files need changes
3. Estimate in T-shirt sizes: XS, S, M, L, XL
4. Identify blockers and risks

## Output Format
| Task | Complexity | Risk | Size | Dependencies |
|------|-----------|------|------|-------------|
| ... | ... | ... | ... | ... |

**Total estimate**: [size]
**Key risks**: [list]
**Recommended approach**: [description]
**Suggested order**: [numbered list]
