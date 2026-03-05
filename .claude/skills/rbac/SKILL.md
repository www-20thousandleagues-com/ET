---
name: rbac
description: Implement role-based access control — roles, permissions, guards
argument-hint: <roles> (e.g., "admin,editor,viewer", "owner,member,guest")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Role-Based Access Control

Roles: $ARGUMENTS

## Database Schema
```sql
-- Roles table
CREATE TABLE roles (id uuid, name text UNIQUE, description text);

-- User-role mapping
CREATE TABLE user_roles (user_id uuid REFERENCES auth.users, role_id uuid REFERENCES roles);

-- Permissions
CREATE TABLE permissions (id uuid, resource text, action text);

-- Role-permission mapping
CREATE TABLE role_permissions (role_id uuid REFERENCES roles, permission_id uuid REFERENCES permissions);
```

## RLS Policies
- Policies check user role via `auth.uid()` joined with `user_roles`
- Admin: full access to all resources
- Editor: create, read, update own resources
- Viewer: read-only access

## Frontend
- Permission check hook: `usePermission('resource', 'action')`
- Role guard component: `<RequireRole role="admin">...</RequireRole>`
- Conditional UI rendering based on permissions
- Route-level access control
