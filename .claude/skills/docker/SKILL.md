---
name: docker
description: Create Docker configuration — Dockerfile, docker-compose, multi-stage builds
argument-hint: <action> (e.g., "create Dockerfile", "add docker-compose", "optimize image")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Docker Configuration

Action: $ARGUMENTS

## Dockerfile (Multi-Stage Build)
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## Docker Compose
- App service (Vite dev server or Nginx for production)
- Database service (PostgreSQL for local dev)
- Redis service (if caching needed)
- Volume mounts for hot reload in development
- Health checks for all services
- Environment variable management

## Best Practices
- Use `.dockerignore` to exclude node_modules, .git, etc.
- Pin base image versions (no `latest` tag)
- Use Alpine images for smaller size
- Cache dependency install layer separately from source code
- Run as non-root user
- Scan images for vulnerabilities
