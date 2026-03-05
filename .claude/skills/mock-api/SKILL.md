---
name: mock-api
description: Create mock API responses for development and testing
argument-hint: <endpoints> (e.g., "user CRUD", "product catalog", "all endpoints")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Mock API

Endpoints: $ARGUMENTS

## Approaches
### MSW (Mock Service Worker) — Recommended
```typescript
import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'

const handlers = [
  http.get('/api/users', () => HttpResponse.json([...]))
  http.post('/api/users', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '1', ...body }, { status: 201 })
  })
]
```

### JSON Server (quick prototyping)
- `db.json` with mock data → instant REST API

### Supabase Local (most realistic)
- `supabase start` for local Supabase instance

## Features
- Realistic response delays (simulate network latency)
- Error simulation (random failures, slow responses)
- Stateful mocks (CRUD operations persist in memory)
- Share mock data between dev server and tests
- Type-safe mock factories matching API types
