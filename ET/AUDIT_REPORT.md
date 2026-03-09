# Jaegeren — Comprehensive Codebase Audit Report

**Date**: 2026-03-09
**Auditor**: Claude Opus 4.6
**Production Readiness Score**: 5/10

## 1. Overall System Architecture

**Pattern**: Monolithic SPA + BaaS + Workflow Engine

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  React SPA   │────▶│   Supabase   │────▶│ PostgreSQL  │
│  (Vite/TS)   │     │  (Auth+API)  │     │  (6 tables) │
└──────┬───────┘     └──────────────┘     └─────────────┘
       │                                         ▲
       │             ┌──────────────┐             │
       └────────────▶│     n8n      │─────────────┘
                     │ (3 workflows)│────▶ Pinecone
                     └──────────────┘────▶ OpenAI
                                   └────▶ Tavily/SerpAPI
```

- **Frontend**: React 18.3.1 + Vite 6.4.1 + TypeScript 5.9.3, served via nginx
- **Backend**: Supabase (PostgreSQL + Auth + Row-Level Security), no custom server
- **AI Pipeline**: n8n orchestrates RAG queries (OpenAI embeddings → Pinecone → GPT-4o synthesis), web search (Tavily/SerpAPI), and RSS ingestion (18 feeds)
- **Infrastructure**: Docker Compose on single VPS (46.224.81.90), nginx reverse proxy, self-signed SSL
- **Deployment**: Manual `docker compose build && up -d`

## 2. Key Components and Responsibilities

### Frontend (14 components, 4 stores, 2 pages)

| Component | Responsibility |
|-----------|---------------|
| `App.tsx` | Routing, error boundary, theme/auth initialization |
| `DashboardPage.tsx` | Layout orchestration (3-panel: nav + content + sidebar) |
| `AnswerArea.tsx` (~830 lines) | Query results, citations, export, feedback — **largest component** |
| `LeftNav.tsx` | Navigation, saved/recent queries, sources, settings access |
| `RightSidebar.tsx` | System health, query count, recent activity |
| `OverviewDashboard.tsx` | Ground News-style home view with lens-matched articles |
| `SettingsModal.tsx` | User preferences (topics, geographies, lenses) |
| `SavedQueriesView.tsx` | Dedicated saved queries browser |
| `QueryArea.tsx` | Search input with source selection |
| `SourceStrip.tsx` | Horizontal source filter chips |

### Stores (Zustand)

| Store | Scope |
|-------|-------|
| `app.ts` (574 lines) | All application state — queries, sources, articles, UI flags |
| `auth.ts` | Supabase auth session management |
| `locale.ts` | i18n (English/Danish) with localStorage persist |
| `settings.ts` | User preferences with localStorage persist |

### Backend (n8n Workflows)

| Workflow | Trigger | Function |
|----------|---------|----------|
| RAG Query (`77h7wfR2PTvQjOYC`) | Webhook POST | Embed query → Pinecone search → GPT-4o synthesis |
| Web Search (`SgDtQkBCBlfckg4y`) | Webhook POST | Tavily + SerpAPI → GPT-4o synthesis |
| RSS Ingestion (`COwsIcwHmmBzS2MW`) | Cron (6h) | Fetch 18 RSS feeds → dedupe → store articles |

### Database (6 tables with RLS)

`profiles`, `sources`, `articles`, `queries`, `analyses`, `citations` — all protected by Row-Level Security policies scoped to `auth.uid()`.

## 3. Code Quality and Maintainability

### Strengths
- TypeScript strict mode enabled
- Consistent patterns: functional components, Zustand state, Radix/shadcn UI
- Clean imports with path aliases (`@/`)
- i18n coverage: all strings externalized (200+ keys, EN + DA)
- Safe utilities: `safeFormatDate()`, `safeFormatDateTime()`, `cn()`

### Issues

| Severity | Issue |
|----------|-------|
| **High** | `AnswerArea.tsx` at ~830 lines — should be split into 4-5 sub-components |
| **High** | `app.ts` store at 574 lines — needs domain slicing |
| **Medium** | No ESLint or Prettier configuration |
| **Medium** | Zero JSDoc or inline documentation on complex functions |
| **Medium** | `ErrorBoundary` calls `useLocaleStore.getState()` inside `render()` — anti-pattern |
| **Low** | Magic numbers (`.slice(0, 5)`, `40` char truncation) |
| **Low** | Verbose repeated Tailwind classes |

## 4. Security Risks and Vulnerabilities

### Critical

| # | Risk | Location |
|---|------|----------|
| 1 | `.env` with live Supabase JWT in git-accessible directory | `/opt/jaegeren/repo/ET/.env` |
| 2 | Supabase anon key in docker-compose build args | `docker-compose.yml` |
| 3 | n8n workflows contain hardcoded API keys | Tavily, SerpAPI |
| 4 | Self-signed SSL certificates | nginx config |

### Medium

| # | Risk |
|---|------|
| 5 | No rate limiting on Supabase RPC calls |
| 6 | n8n webhook endpoints lack authentication |
| 7 | `document.write()` usage (potential XSS) |
| 8 | No CSP `frame-ancestors` directive |
| 9 | Docker containers run as root |

### Good Practices
- RLS policies scope all queries to `auth.uid()`
- GDPR delete cascade policy
- No hardcoded secrets in frontend source
- Proper URL validation, auth state management, error sanitization

## 5. Performance and Scalability

| Severity | Issue |
|----------|-------|
| **High** | Single VPS = no horizontal scaling, no redundancy |
| **High** | n8n + app on same server — resource contention |
| **Medium** | No query result caching |
| **Medium** | 5 API calls on every DashboardPage mount with no caching |
| **Medium** | RSS ingestion processes 18 feeds sequentially |
| **Low** | No pagination on articles list |
| **Low** | No Zustand selector memoization for derived state |

Estimated ceiling: ~50 concurrent users before degradation.

## 6. Dependency and Third-Party Risk

### Vendor Lock-in
- **Supabase**: HIGH — Auth, database, RLS all coupled
- **Pinecone**: MEDIUM — replaceable with pgvector
- **n8n**: MEDIUM — workflow logic in JSON, not code
- **OpenAI**: LOW — abstracted through n8n

### Supply Chain
- No `package-lock.json` committed
- No Dependabot or Renovate
- No license audit

## 7. Technical Debt and Refactoring Opportunities

### High Priority
1. Split AnswerArea.tsx into 4-5 focused components
2. Split app.ts store into domain slices
3. Add lockfile
4. Extract API config to environment with validation

### Medium Priority
5. Add React Query/SWR for data fetching
6. Implement query result caching
7. Add ESLint + Prettier with pre-commit hooks
8. Replace `document.write()` usage
9. Add error boundaries per route section

## 8. Testing and DevOps Evaluation

- **Testing**: 0/10 — Zero test files, no test framework
- **CI/CD**: 1/10 — No pipeline, manual builds
- **DevOps**: 3/10 — Docker Compose works, no monitoring/alerting
- **Deployment**: SSH + manual commands, no rollback

## 9. Actionable Recommendations

### P0 — Critical
1. Move secrets to Docker secrets / `.env` excluded from git
2. Add `.env` to `.gitignore`, rotate keys
3. Install Let's Encrypt SSL
4. Add n8n webhook authentication
5. Commit `package-lock.json`

### P1 — High
6. Add Vitest + Testing Library
7. Add ESLint + Prettier with husky
8. Set up GitHub Actions CI
9. Split AnswerArea.tsx
10. Split app.ts store
11. Fix broken RSS feeds
12. Add container resource limits

### P2 — Medium
13. Add React Query for server state
14. Query result caching
15. Playwright E2E tests
16. Staging environment
17. Monitoring + alerting
18. Structured logging
19. Health check endpoint

### P3 — Low
20. Evaluate pgvector migration
21. Dependabot
22. Non-root containers
23. i18n for n8n error messages
24. Blue-green deployment
