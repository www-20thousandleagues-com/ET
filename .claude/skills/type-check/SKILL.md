---
name: type-check
description: Deep TypeScript type analysis — find and fix type errors, improve type safety
argument-hint: [path] (optional)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Type Check

Scope: $ARGUMENTS

## Process
1. Run full type check: `cd ET && npx tsc --noEmit 2>&1`
2. Categorize errors by severity:
   - **Critical**: Runtime-affecting type mismatches
   - **Moderate**: Implicit `any`, missing generics
   - **Minor**: Style issues, overly broad types
3. Fix each error, starting with critical
4. Improve type safety:
   - Replace `any` with specific types
   - Add discriminated unions for state machines
   - Use `as const` for literal types
   - Add generic constraints where applicable
   - Use template literal types for string patterns
   - Add `readonly` to immutable data
5. Re-run type check to verify zero errors

## Rules
- Never use `@ts-ignore` — fix the underlying issue
- `@ts-expect-error` only with a comment explaining why
- Prefer type inference over explicit annotations where obvious
