---
name: rate-limit
description: Implement rate limiting for APIs and endpoints
argument-hint: <endpoint> <limit> (e.g., "/api/auth/login 5/minute", "global 100/minute")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Rate Limiting

Target: $ARGUMENTS

## Algorithms
- **Fixed Window**: Simple counter per time window (easy but bursty at boundaries)
- **Sliding Window**: Smoother, weighted between current and previous window
- **Token Bucket**: Allows bursts up to bucket size, refills at steady rate
- **Leaky Bucket**: Processes at fixed rate, queues excess

## Implementation (Supabase)
1. Create rate limit table or use Redis
2. Track requests by IP, user ID, or API key
3. Return 429 Too Many Requests with Retry-After header
4. Different limits per endpoint sensitivity:
   - Auth endpoints: 5/minute
   - API reads: 100/minute
   - API writes: 30/minute
   - File uploads: 10/minute
5. Exempt trusted IPs/services
6. Log rate limit hits for monitoring
