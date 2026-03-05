---
name: ci-cd
description: Set up CI/CD pipelines — GitHub Actions, automated testing, deployment
argument-hint: <action> (e.g., "setup GitHub Actions", "add test pipeline", "add deploy workflow")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# CI/CD Pipeline

Action: $ARGUMENTS

## GitHub Actions Workflows

### CI Pipeline (on push/PR)
```yaml
name: CI
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: npx tsc --noEmit
      - run: pnpm test (if configured)
      - run: pnpm lint (if configured)
```

### Deploy Pipeline (on merge to main)
- Build → Test → Deploy to staging → Smoke tests → Promote to production
- Or: Build → Test → Deploy to Vercel/Supabase automatically

## Pipeline Stages
1. **Install**: Cache dependencies, install packages
2. **Lint**: ESLint, Prettier, TypeScript type checking
3. **Test**: Unit tests, integration tests
4. **Build**: Production build, check bundle size
5. **E2E**: Playwright browser tests
6. **Deploy**: Vercel/Supabase/custom deployment
7. **Notify**: Slack/email notification of result
