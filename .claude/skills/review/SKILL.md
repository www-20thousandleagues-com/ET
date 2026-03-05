---
name: review
description: Comprehensive code review of current changes or a PR
argument-hint: [pr-number]
disable-model-invocation: true
context: fork
agent: Explore
---

# Code Review

Review: $ARGUMENTS

## If PR number provided
Run `gh pr diff $1` and `gh pr view $1` to get context.

## If no argument
Run `git diff` and `git diff --cached` to review local changes.

## Review Checklist
1. **Correctness** — Does the code do what it claims?
2. **Security** — SQL injection, XSS, command injection, secrets exposure
3. **Performance** — N+1 queries, unnecessary re-renders, large bundle imports
4. **TypeScript** — Proper types, no unnecessary `any`, null safety
5. **React patterns** — Proper hook usage, key props, memo where needed
6. **Accessibility** — ARIA labels, keyboard navigation, semantic HTML
7. **Error handling** — Loading/error/empty states for async ops
8. **Style** — Consistent with project conventions in CLAUDE.md

## Output Format
For each finding, provide:
- **Severity**: Critical / Warning / Suggestion
- **File:Line**: Location
- **Issue**: What's wrong
- **Fix**: How to fix it
