---
name: queue
description: Set up job/task queues for background processing
argument-hint: <queue-name> <job-type> (e.g., "email-queue send-welcome-email")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Job Queue

Create: $ARGUMENTS

## Approaches
### 1. Supabase Database Queue (Simple)
- Use a `jobs` table with status tracking
- Edge Function polls or triggers on insert
- Fields: id, type, payload, status, attempts, created_at, processed_at, error

### 2. Supabase Realtime + Edge Functions
- Insert job → Realtime trigger → Edge Function processes

### 3. External Queue Service
- Redis (BullMQ), AWS SQS, CloudFlare Queues

## Implementation
1. Create jobs table with proper indexes
2. Create producer function (enqueue jobs)
3. Create consumer function (process jobs)
4. Add retry logic with exponential backoff
5. Add dead letter handling for permanently failed jobs
6. Add monitoring/alerting for queue depth and failure rate
7. Add concurrency control to prevent overwhelming downstream services
