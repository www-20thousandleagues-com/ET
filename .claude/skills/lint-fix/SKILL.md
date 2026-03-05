---
name: lint-fix
description: Find and fix linting, formatting, and code style issues across the project
argument-hint: [path] (optional — defaults to entire project)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Lint Fix

Scope: $ARGUMENTS

## Process
1. Run TypeScript compiler: `cd ET && npx tsc --noEmit 2>&1 | head -100`
2. Check for common issues via grep:
   - `console.log` statements in production code
   - Unused imports
   - `any` type usage
   - Missing return types on exported functions
   - Inconsistent quote style
   - Missing semicolons or extra semicolons
3. Fix all found issues
4. If ESLint/Prettier configured, run: `cd ET && npx eslint --fix .`
5. Verify build: `cd ET && pnpm build`

## Auto-fix Patterns
- Remove unused imports
- Replace `any` with proper types where inferrable
- Add missing `key` props in mapped JSX
- Fix hook dependency arrays
- Normalize import ordering (react → external → internal → relative)
