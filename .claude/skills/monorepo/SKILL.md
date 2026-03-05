---
name: monorepo
description: Set up or manage monorepo structure — workspaces, shared packages, build orchestration
argument-hint: <action> (e.g., "setup pnpm workspaces", "add shared package", "configure turborepo")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Monorepo

Action: $ARGUMENTS

## pnpm Workspaces Setup
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

## Structure
```
root/
├── apps/
│   ├── web/          # Main web application
│   ├── admin/        # Admin dashboard
│   └── mobile/       # React Native app
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared utilities
│   ├── config/       # Shared configs (ESLint, TypeScript, Tailwind)
│   └── types/        # Shared TypeScript types
├── pnpm-workspace.yaml
└── turbo.json        # Build orchestration
```

## Turborepo Config
- Parallel builds for independent packages
- Caching for unchanged packages
- Dependency graph-aware task ordering
- Remote caching for CI speed

## Shared Package Pattern
- Build with `tsup` (lightweight, fast)
- Export both ESM and CJS
- Include TypeScript declarations
- Version with changesets
