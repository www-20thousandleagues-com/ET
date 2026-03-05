---
name: git-cleanup
description: Clean up git — prune branches, squash history, fix commit messages
argument-hint: <action> (e.g., "prune merged branches", "list stale branches", "clean up history")
disable-model-invocation: true
allowed-tools: Bash, Read, Grep
---

# Git Cleanup

Action: $ARGUMENTS

## Safe Operations
- List merged branches: `git branch --merged main`
- List stale remote branches: `git remote prune origin --dry-run`
- Show branch age: `git for-each-ref --sort=-committerdate refs/heads/ --format='%(committerdate:short) %(refname:short)'`
- Check branch tracking status: `git branch -vv`

## Cleanup Actions (ask before executing)
- Delete merged local branches: `git branch --merged main | grep -v main | xargs git branch -d`
- Prune remote tracking: `git remote prune origin`
- Delete specific stale branch: `git branch -d <branch>`
- Clean untracked files (DRY RUN first): `git clean -n`

## Rules
- NEVER force delete (-D) without confirming with user
- NEVER delete main/master/develop branches
- Always do a dry run first
- Preserve branches with open PRs
- Check if branches have unmerged commits before deleting
