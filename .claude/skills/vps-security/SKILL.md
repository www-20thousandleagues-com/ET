---
name: vps-security
description: VPS security audit and hardening — SSH, firewall, Docker, fail2ban, updates
argument-hint: <action> (e.g., "full audit", "harden SSH", "setup fail2ban", "check vulnerabilities")
disable-model-invocation: true
allowed-tools: Bash, Read, Write
---

# VPS Security

Action: $ARGUMENTS

## Security Audit Checklist (via SSH)
```bash
# SSH config check
grep -E "PasswordAuthentication|PermitRootLogin|Port" /etc/ssh/sshd_config

# Firewall status
ufw status verbose

# Fail2ban status
fail2ban-client status

# Open ports
ss -tlnp

# Running services
systemctl list-units --type=service --state=running

# Pending security updates
apt list --upgradable 2>/dev/null | grep -i security

# Docker security
docker ps --format '{{.Names}} {{.Image}}' | while read name image; do
  echo "$name: $image"
done

# Check for unauthorized SSH keys
cat ~/.ssh/authorized_keys

# Last logins
last -10
```

## Hardening Steps
1. SSH: Key-only auth, disable root login, change port
2. UFW: Default deny, allow only needed ports (22, 80, 443, 5678)
3. fail2ban: Install and configure for SSH + n8n
4. Auto-updates: `unattended-upgrades` for security patches
5. Docker: Don't run containers as root, use read-only filesystems
6. Nginx: Enable rate limiting, hide version headers
7. SSL: Force HTTPS, HSTS headers
8. Monitoring: Set up log alerting for suspicious activity
