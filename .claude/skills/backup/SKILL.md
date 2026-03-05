---
name: backup
description: Set up database and file backup strategies
argument-hint: <target> (e.g., "database", "storage", "full system")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Backup Strategy

Target: $ARGUMENTS

## Supabase Backups
- **Automatic**: Supabase Pro plan includes daily backups
- **Manual**: pg_dump via Supabase CLI or direct connection
- **Point-in-Time Recovery**: Available on Pro plan

## Custom Backup Implementation
1. Database backup script (pg_dump to file)
2. Storage bucket backup (sync to secondary location)
3. Configuration backup (.env, settings, migrations)
4. Schedule via cron job
5. Test restore procedure regularly
6. Monitor backup success/failure

## Backup Rules
- 3-2-1 rule: 3 copies, 2 different media, 1 offsite
- Encrypt backups at rest
- Test restores monthly
- Document restore procedure
- Set retention policy (e.g., daily for 7 days, weekly for 4 weeks, monthly for 12 months)
