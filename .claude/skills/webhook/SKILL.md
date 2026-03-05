---
name: webhook
description: Create webhook endpoints — receive, validate, and process external events
argument-hint: <source> <events> (e.g., "Stripe payment.succeeded,payment.failed")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Webhook Endpoint

Source: $ARGUMENTS

## Supabase Edge Function Webhook
```
supabase/functions/<webhook-name>/index.ts
```

## Implementation
1. Parse incoming webhook payload
2. Validate signature/authenticity (HMAC, API key, etc.)
3. Extract event type and data
4. Route to appropriate handler by event type
5. Process event (update DB, trigger notifications, etc.)
6. Return 200 OK quickly (process async if heavy)
7. Handle retries and idempotency

## Requirements
- Signature verification (never trust unverified webhooks)
- Idempotent processing (handle duplicate deliveries)
- Proper error responses (4xx for bad requests, 5xx for server errors)
- Logging for debugging and audit
- Dead letter queue for failed processing
- Timeout handling (respond within source's timeout limit)
