---
name: notifications
description: Build notification system — in-app, push, email, toast
argument-hint: <type> (e.g., "in-app bell", "push notifications", "toast system", "email digest")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Notification System

Type: $ARGUMENTS

## Notification Channels
- **Toast** (sonner — already installed): Transient, in-context feedback
- **In-App**: Persistent notification center with bell icon and badge
- **Push**: Browser push notifications via service worker
- **Email**: Digest emails for offline notifications
- **SMS**: Critical alerts via Twilio/Supabase

## In-App Notification System
1. Create `notifications` table in Supabase
2. Realtime subscription for new notifications
3. Notification bell component with unread count
4. Dropdown panel listing recent notifications
5. Mark as read (individual and bulk)
6. Notification preferences per user
7. Different notification types with icons and colors
8. Click-through to relevant content
9. Batch/digest grouping for similar notifications
