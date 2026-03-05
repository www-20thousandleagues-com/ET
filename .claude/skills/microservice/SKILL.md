---
name: microservice
description: Design and build a microservice — API, database, deployment, communication
argument-hint: <service-name> <purpose> (e.g., "notification-service handle all notifications")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Microservice

Create: $ARGUMENTS

## Service Structure
```
services/<name>/
├── src/
│   ├── index.ts         # Entry point
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── models/          # Data models
│   └── middleware/       # Request middleware
├── tests/
├── Dockerfile
├── package.json
└── README.md
```

## Design Principles
- Single responsibility — one domain per service
- Own its data — dedicated database/schema
- API-first — well-defined contract (OpenAPI/JSON Schema)
- Independently deployable
- Health check endpoint
- Structured logging with correlation IDs
- Circuit breaker for external dependencies

## Communication Patterns
- **Sync**: REST/gRPC for request-response
- **Async**: Message queue (Redis Pub/Sub, NATS, SQS) for events
- **Event Sourcing**: For audit trail and replay capabilities
