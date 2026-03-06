#!/bin/bash
# Jaegeren auto-deploy script
set -euo pipefail

LOG="/var/log/jaegeren-deploy.log"
REPO="/opt/jaegeren/repo"
COMPOSE_DIR="/opt/jaegeren"

log() { echo "$(date '+%Y-%m-%d %H:%M:%S') — $1" | tee -a "$LOG"; }

log "Deploy triggered"

# Pull latest code
cd "$REPO"
git fetch origin main
BEFORE=$(git rev-parse HEAD)
git reset --hard origin/main
AFTER=$(git rev-parse HEAD)

if [ "$BEFORE" = "$AFTER" ]; then
  log "No changes detected (${BEFORE:0:8}), skipping build"
  exit 0
fi

log "Updating from ${BEFORE:0:8} to ${AFTER:0:8}"

# Build and deploy
cd "$COMPOSE_DIR"
docker compose build app 2>&1 | tail -5 >> "$LOG"
docker compose up -d app 2>&1 >> "$LOG"

# Wait for health check
log "Waiting for health check..."
for i in $(seq 1 30); do
  if docker compose exec -T app wget --no-verbose --tries=1 --spider http://127.0.0.1:80/ 2>/dev/null; then
    log "Health check passed after ${i}s"
    break
  fi
  if [ "$i" -eq 30 ]; then
    log "ERROR: Health check failed after 30s"
    exit 1
  fi
  sleep 1
done

# Prune old images
docker image prune -f >> "$LOG" 2>&1

log "Deploy complete (${AFTER:0:8})"
