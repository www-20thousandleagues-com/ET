---
name: refactor
description: Refactor code for better structure, readability, and maintainability
argument-hint: <file-or-pattern> [goal] (e.g., "src/app/components/LeftNav.tsx extract hooks")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Refactor

Target: $ARGUMENTS

## Process
1. Read the target code thoroughly — understand every function, dependency, and side effect
2. Identify refactoring opportunities:
   - Extract reusable hooks from component logic
   - Split large components (>150 lines) into focused sub-components
   - Replace magic numbers/strings with named constants
   - Simplify complex conditionals
   - Remove dead code paths
   - Consolidate duplicate logic
   - Improve naming for clarity
3. Plan changes to maintain identical behavior — refactoring must NOT change functionality
4. Apply changes incrementally, verifying build after each step: `cd ET && pnpm build`
5. Update all imports and references across the codebase
6. Run tests if they exist to verify nothing broke

## Rules
- NEVER change behavior — only structure
- Keep changes reviewable — small, focused commits
- Preserve all existing public APIs/exports
- If uncertain about a change, skip it and note it as a suggestion
