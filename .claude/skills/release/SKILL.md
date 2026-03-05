---
name: release
description: Create a versioned release — changelog, tag, GitHub release, deploy
argument-hint: <version-type> (e.g., "patch", "minor", "major", "1.2.3")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Release

Version: $ARGUMENTS

## Process
1. Verify main branch is clean and up to date
2. Determine version bump (semver):
   - **patch**: Bug fixes, no new features (0.0.X)
   - **minor**: New features, backward compatible (0.X.0)
   - **major**: Breaking changes (X.0.0)
3. Update version in package.json
4. Generate changelog from commits since last release
5. Create git tag: `git tag v{version}`
6. Create GitHub release with changelog: `gh release create`
7. Deploy to production
8. Notify team (Slack/email)

## Changelog Format
```markdown
## [1.2.0] - 2026-03-05
### Added
- New feature description
### Changed
- Changed behavior description
### Fixed
- Bug fix description
### Removed
- Removed feature description
```
