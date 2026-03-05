---
name: vps-backup
description: Backup VPS data — Docker volumes, databases, n8n workflows, configurations
argument-hint: <scope> (e.g., "full backup", "n8n workflows", "database only")
disable-model-invocation: true
allowed-tools: Bash, Read
---

# VPS Backup

Scope: $ARGUMENTS

## Backup Targets
1. **Docker Compose files**: `/opt/docker/` or wherever compose files live
2. **Docker volumes**: Named volumes with persistent data
3. **n8n data**: Workflows, credentials, execution history
4. **Database**: PostgreSQL dump
5. **SSL certificates**: Let's Encrypt certs
6. **Nginx config**: `/etc/nginx/`
7. **Environment files**: `.env` files (encrypt before backup)

## Backup Commands (via SSH)
```bash
# n8n workflow export
docker compose exec n8n n8n export:workflow --all --output=/tmp/n8n-workflows.json
docker compose exec n8n n8n export:credentials --all --output=/tmp/n8n-credentials.json

# PostgreSQL dump
docker compose exec postgres pg_dump -U postgres > /tmp/db-backup.sql

# Docker volume backup
docker run --rm -v myvolume:/data -v /tmp:/backup alpine tar czf /backup/volume.tar.gz /data

# Hetzner snapshot (via Hetzner MCP)
# Creates a full server snapshot — best for disaster recovery
```

## Backup Schedule
- n8n workflows: Daily
- Database: Daily
- Full server snapshot: Weekly
- Config files: On every change
