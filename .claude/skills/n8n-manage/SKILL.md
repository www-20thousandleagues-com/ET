---
name: n8n-manage
description: Manage n8n instance — list workflows, check executions, activate/deactivate, troubleshoot
argument-hint: <action> (e.g., "list active workflows", "check failed executions", "restart workflow X")
disable-model-invocation: true
allowed-tools: Bash, Read, Grep
---

# n8n Management

Action: $ARGUMENTS

## Operations (via n8n-api MCP)
- List all workflows with status
- Get workflow details by ID
- Activate/deactivate workflows
- List recent executions (filter by status: success, error, waiting)
- Get execution details and error messages
- Delete old executions
- Export workflows for backup
- Import workflows from JSON

## Troubleshooting
1. Check recent failed executions
2. Read error messages and stack traces
3. Check n8n container logs: `docker compose logs n8n --tail=200`
4. Check n8n memory/CPU usage
5. Verify credentials are still valid
6. Check webhook URLs are accessible
7. Verify connected services are responding

## Maintenance
- Clean up old executions (>30 days)
- Review and disable unused workflows
- Update n8n Docker image
- Backup all workflows and credentials
- Monitor execution queue length
