---
name: blue-green
description: Set up blue-green deployment strategy for zero-downtime releases
argument-hint: <platform> (e.g., "Vercel", "AWS", "Docker")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Blue-Green Deployment

Platform: $ARGUMENTS

## Strategy
1. Two identical environments: Blue (current) and Green (new)
2. Deploy new version to Green environment
3. Run smoke tests against Green
4. Switch traffic from Blue to Green (DNS, load balancer, or platform feature)
5. Monitor for errors
6. If issues: instant rollback by switching back to Blue
7. Once stable: Blue becomes the next deployment target

## Implementation by Platform
- **Vercel**: Automatic via preview deployments → promote to production
- **Docker**: Two services behind a load balancer, swap targets
- **AWS**: ALB target group switching or Route 53 weighted routing
- **Cloudflare**: Workers routing with A/B traffic split
