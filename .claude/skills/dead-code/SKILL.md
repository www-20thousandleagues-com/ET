---
name: dead-code
description: Find and remove unused code, imports, variables, functions, and files
argument-hint: [path] (optional — defaults to entire project)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Dead Code Elimination

Scope: $ARGUMENTS

## Process
1. Find unused exports — search for each export and check if it's imported anywhere
2. Find unused files — check if any file has zero importers
3. Find unused variables and functions within files
4. Find unused dependencies in package.json
5. Find unused CSS classes/Tailwind utilities
6. Remove all confirmed dead code
7. Verify build: `cd ET && pnpm build`

## Safety Rules
- NEVER remove code that might be used dynamically (string-based imports, reflection)
- Check for usage in tests before removing
- Check for usage in config files (vite.config, tailwind.config)
- If uncertain, comment with `// TODO: verify if used` instead of deleting
- Remove one category at a time and verify build between each
