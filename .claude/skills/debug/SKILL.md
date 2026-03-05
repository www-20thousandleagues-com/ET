---
name: debug
description: Investigate and fix a bug with systematic debugging
argument-hint: <bug-description-or-error-message>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, Agent
---

# Debug

Issue: $ARGUMENTS

## Systematic Debugging Process
1. **Reproduce** — Understand the exact steps/conditions that trigger the bug
2. **Isolate** — Narrow down to the smallest code path that causes the issue
3. **Trace** — Follow the data flow from input to output:
   - Search for the error message in codebase
   - Find the function/component where it originates
   - Trace callers and data flow upstream
4. **Hypothesize** — Form a theory about root cause
5. **Verify** — Add targeted logging or read code to confirm theory
6. **Fix** — Apply minimal fix addressing the root cause, not symptoms
7. **Validate** — Verify build passes, error is gone, no regressions
8. **Clean up** — Remove debug logging, add regression test if possible

## Common Bug Patterns to Check
- Null/undefined access on optional chains
- Stale closure in useEffect/useCallback
- Missing dependency in hook arrays
- Race conditions in async operations
- Off-by-one errors in array/pagination logic
- Type coercion issues (== vs ===)
- Event handler binding issues
- CSS specificity/ordering conflicts
