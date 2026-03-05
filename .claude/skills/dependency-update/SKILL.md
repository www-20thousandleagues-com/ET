---
name: dependency-update
description: Update project dependencies safely — check, update, test, fix breaking changes
argument-hint: [package-name] (optional — defaults to all outdated)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Dependency Update

Target: $ARGUMENTS

## Process
1. Check outdated packages: `cd ET && pnpm outdated`
2. Check for security vulnerabilities: `cd ET && pnpm audit`
3. Categorize updates:
   - **Patch**: Safe, apply all at once
   - **Minor**: Usually safe, apply in batches
   - **Major**: Breaking changes, apply one at a time
4. For each update batch:
   a. Update package(s): `cd ET && pnpm update <package>`
   b. Check for breaking changes in changelog/release notes
   c. Fix any breaking changes in codebase
   d. Verify build: `cd ET && pnpm build`
   e. Run tests
5. Commit each batch separately with descriptive message

## Risk Assessment
- Check download counts and maintenance status
- Check if package is still actively maintained
- Check for known vulnerabilities (Snyk, npm audit)
- For major updates, read migration guide first
