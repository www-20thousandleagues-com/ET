---
name: multi-tenant
description: Implement multi-tenancy — organizations, workspaces, team management
argument-hint: <model> (e.g., "shared database", "schema per tenant", "organization model")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Multi-Tenancy

Model: $ARGUMENTS

## Database Design
```sql
-- Organizations/tenants
CREATE TABLE organizations (
  id uuid PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text DEFAULT 'free',
  created_at timestamptz DEFAULT now()
);

-- Members
CREATE TABLE organization_members (
  org_id uuid REFERENCES organizations,
  user_id uuid REFERENCES auth.users,
  role text DEFAULT 'member', -- owner, admin, member
  PRIMARY KEY (org_id, user_id)
);

-- All tenant data has org_id
CREATE TABLE projects (
  id uuid PRIMARY KEY,
  org_id uuid REFERENCES organizations NOT NULL,
  -- ... other fields
);
```

## RLS for Tenant Isolation
- Every query filtered by org_id
- RLS policies check org membership
- Users can belong to multiple organizations
- Organization context stored in app state

## Features
- Organization creation and setup wizard
- Invite members (email invite flow)
- Role management within organization
- Organization switcher UI
- Per-organization settings and billing
- Data export per organization
