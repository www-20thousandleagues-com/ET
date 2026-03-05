---
name: migration-rollback
description: Create rollback plan and execute database migration rollbacks
argument-hint: <migration-name-or-version>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Migration Rollback

Target: $ARGUMENTS

## Process
1. Identify the migration to rollback
2. Check current migration state
3. Verify rollback SQL exists and is correct
4. Check for data that would be lost (new columns with data, new tables with rows)
5. Create backup before rollback
6. Execute rollback in transaction
7. Verify database state after rollback
8. Update application code if needed (remove references to rolled-back schema)

## Safety
- ALWAYS backup before rollback
- Run rollback in a transaction
- Test rollback on staging first
- Check for data dependencies before dropping columns/tables
- Coordinate with team — rollback may break other branches
- Document why rollback was necessary
