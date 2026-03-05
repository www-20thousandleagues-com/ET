---
name: cherry-pick
description: Cherry-pick commits between branches safely
argument-hint: <commit-hash> <target-branch> (e.g., "abc123 release/1.0")
disable-model-invocation: true
allowed-tools: Bash, Read, Grep
---

# Cherry Pick

Pick: $ARGUMENTS

## Process
1. Verify the commit exists and understand what it changes: `git show $1`
2. Check target branch: `git log $2 --oneline -5`
3. Create a new branch for the cherry-pick: `git checkout -b cherry-pick/$1 $2`
4. Cherry-pick: `git cherry-pick $1`
5. If conflicts, resolve them carefully
6. Verify build: `cd ET && pnpm build`
7. Push and create PR to target branch

## Safety
- Never cherry-pick without understanding the commit fully
- Check for dependent commits that also need picking
- Resolve conflicts carefully — don't blindly accept ours/theirs
- Test after cherry-pick to ensure it works in the target context
