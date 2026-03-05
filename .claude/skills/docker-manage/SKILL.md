---
name: docker-manage
description: Manage Docker containers on VPS — compose, logs, restart, clean, monitor
argument-hint: <action> (e.g., "list containers", "check logs n8n", "clean unused images", "restart all")
disable-model-invocation: true
allowed-tools: Bash, Read
---

# Docker Management

Action: $ARGUMENTS

## Common Commands (via SSH MCP)

### Status
```bash
docker compose ps                                    # Container status
docker stats --no-stream                             # Resource usage
docker system df                                     # Disk usage by Docker
```

### Logs
```bash
docker compose logs <service> --tail=100             # Last 100 lines
docker compose logs <service> --since 1h             # Last hour
docker compose logs <service> -f                     # Follow (live)
docker compose logs <service> 2>&1 | grep -i error   # Errors only
```

### Lifecycle
```bash
docker compose restart <service>                     # Restart service
docker compose stop <service>                        # Stop service
docker compose up -d <service>                       # Start service
docker compose down                                  # Stop all
docker compose up -d                                 # Start all
```

### Updates
```bash
docker compose pull                                  # Pull latest images
docker compose up -d --remove-orphans                # Apply updates
docker image prune -f                                # Remove old images
```

### Cleanup
```bash
docker system prune -f                               # Remove stopped containers, networks, images
docker volume prune -f                               # Remove unused volumes (CAREFUL!)
```
