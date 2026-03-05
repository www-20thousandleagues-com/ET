---
name: vps-deploy
description: Deploy services to VPS — Docker compose up, update containers, rollback
argument-hint: <action> (e.g., "update n8n", "deploy new service", "rollback last deploy")
disable-model-invocation: true
allowed-tools: Bash, Read, Write, Edit
---

# VPS Deployment

Action: $ARGUMENTS

## Deploy Process (via SSH MCP)
1. Backup current state: `docker compose config > backup-compose.yml`
2. Pull latest images: `docker compose pull`
3. Apply changes: `docker compose up -d`
4. Verify all containers healthy: `docker compose ps`
5. Check logs for errors: `docker compose logs --tail=50`
6. Run smoke tests against services

## Rollback
1. Stop current containers: `docker compose down`
2. Restore backup compose file
3. Start with previous config: `docker compose up -d`

## Zero-Downtime Update (for services behind Nginx)
1. Scale up new version: `docker compose up -d --scale app=2`
2. Wait for new instance health check
3. Remove old instance: `docker compose up -d --scale app=1`

## Safety Rules
- ALWAYS backup before deploying
- Check disk space before pulling new images
- Verify health checks after deployment
- Keep previous 2 image versions available for rollback
- Deploy during low-traffic windows for risky changes
