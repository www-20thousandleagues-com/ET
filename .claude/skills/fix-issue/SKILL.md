---
name: fix-issue
description: Analyze and fix a GitHub issue end-to-end
argument-hint: <issue-number-or-description>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash, Agent
---

# Fix Issue

Fix the issue: $ARGUMENTS

## Process
1. If a GitHub issue number is provided, use `gh issue view $1` to get full details
2. Analyze the issue — understand root cause, affected files, and scope
3. Search the codebase for relevant files using Grep and Glob
4. Implement the fix with minimal changes
5. Verify the fix compiles: `cd ET && pnpm build`
6. Write or update tests if applicable
7. Create a descriptive commit using conventional commits format
8. Push branch and create a PR linking the issue

## Rules
- Keep changes minimal and focused on the issue
- Do not refactor unrelated code
- Include the issue reference in the PR body
