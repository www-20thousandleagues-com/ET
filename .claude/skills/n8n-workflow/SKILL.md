---
name: n8n-workflow
description: Design and build an n8n workflow for automation
argument-hint: <description> (e.g., "send Slack notification when Stripe payment received")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# n8n Workflow Builder

Build: $ARGUMENTS

## Process
1. Understand the automation requirement
2. Identify trigger type (webhook, schedule, event, manual)
3. Map the data flow: Source → Transform → Destination
4. Select n8n nodes for each step (use n8n MCP for node docs)
5. Design error handling (retry, fallback, notification)
6. Build workflow JSON
7. Deploy via n8n API MCP or manual import
8. Test with sample data
9. Activate in production

## Workflow JSON Structure
```json
{
  "name": "Workflow Name",
  "nodes": [...],
  "connections": {...},
  "settings": { "executionOrder": "v1" },
  "tags": [...]
}
```

## Common Triggers
- **Webhook**: Receive HTTP requests from external services
- **Schedule**: Cron-based recurring execution
- **Supabase Trigger**: React to database changes
- **Email Trigger**: Process incoming emails
- **Manual**: On-demand execution via API or UI
