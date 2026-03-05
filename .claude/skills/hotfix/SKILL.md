---
name: hotfix
description: Emergency hotfix workflow — branch, fix, test, deploy, merge back
argument-hint: <issue-description>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Hotfix

Issue: $ARGUMENTS

## Emergency Hotfix Process
1. Create hotfix branch from main: `git checkout -b hotfix/<description> main`
2. Identify and fix the issue with MINIMAL changes
3. Verify build: `cd ET && pnpm build`
4. Run critical tests
5. Commit with `fix:` prefix
6. Push and create PR to main
7. Get expedited review (tag critical reviewers)
8. Merge and deploy immediately
9. Cherry-pick fix to development branch if applicable
10. Post-mortem: document root cause and prevention

## Rules
- Hotfix = MINIMUM viable fix only
- No refactoring, no feature additions
- Test the specific fix path thoroughly
- Monitor deployment closely for 30 minutes after deploy
- Create follow-up ticket for proper fix if hotfix is a workaround
