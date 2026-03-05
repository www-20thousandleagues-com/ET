---
name: changelog
description: Generate or update changelog from git history
argument-hint: [since-version] (optional — defaults to last tag)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Changelog Generator

Since: $ARGUMENTS

## Process
1. Get commits since last tag: `git log $(git describe --tags --abbrev=0)..HEAD --oneline`
2. Categorize by conventional commit prefix:
   - `feat:` → Added
   - `fix:` → Fixed
   - `refactor:` → Changed
   - `perf:` → Performance
   - `docs:` → Documentation
   - `chore:` → Maintenance
   - `BREAKING CHANGE:` → Breaking Changes
3. Format into Keep-a-Changelog format
4. Prepend to CHANGELOG.md
5. Include links to PRs/issues where referenced
