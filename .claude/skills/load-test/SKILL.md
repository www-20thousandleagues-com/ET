---
name: load-test
description: Create and run load/stress tests for APIs and pages
argument-hint: <target> <load> (e.g., "API endpoints 100 concurrent users", "homepage 1000 rps")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Load Testing

Target: $ARGUMENTS

## Tools
- **k6** (recommended): JavaScript-based, scriptable
- **Artillery**: YAML config, easy setup
- **autocannon**: Node.js HTTP benchmarking

## k6 Test Script
```javascript
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 20 },   // Ramp up
    { duration: '1m', target: 100 },    // Peak load
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95th percentile < 500ms
    http_req_failed: ['rate<0.01'],     // Error rate < 1%
  },
}
```

## Metrics to Track
- Response time (p50, p95, p99)
- Throughput (requests/second)
- Error rate
- Concurrent connections
- Memory/CPU usage under load
- Database connection pool saturation
