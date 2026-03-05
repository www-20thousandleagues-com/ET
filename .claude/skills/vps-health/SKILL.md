---
name: vps-health
description: Check VPS health — CPU, memory, disk, Docker containers, services
disable-model-invocation: true
allowed-tools: Bash, Read
---

# VPS Health Check

## Via SSH MCP, run these commands on the Hetzner VPS:

### System Health
```bash
uptime                           # Load average
free -h                          # Memory usage
df -h                            # Disk usage
top -bn1 | head -20              # CPU/process overview
```

### Docker Health
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
docker system df                 # Docker disk usage
```

### Service Health
```bash
systemctl status docker
systemctl status nginx           # If using Nginx
curl -s http://localhost:5678/healthz  # n8n health
```

### Network
```bash
ss -tlnp                         # Listening ports
ufw status                       # Firewall rules
```

### Logs (last errors)
```bash
journalctl -p err --since "1 hour ago" --no-pager
docker compose logs --tail=50 2>&1 | grep -i error
```

## Alert Thresholds
- CPU load > 80% sustained → investigate
- Memory > 85% used → consider upgrading or optimizing
- Disk > 80% full → clean up or expand
- Any Docker container not "Up" → restart or investigate
