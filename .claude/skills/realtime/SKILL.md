---
name: realtime
description: Add real-time features — live updates, presence, typing indicators, notifications
argument-hint: <feature> (e.g., "live comments", "online presence", "typing indicator", "live dashboard")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Realtime Features

Feature: $ARGUMENTS

## Supabase Realtime
- **Postgres Changes**: Listen to INSERT, UPDATE, DELETE on tables
- **Broadcast**: Send ephemeral messages to all connected clients
- **Presence**: Track online users, cursors, typing status

## Implementation Patterns
### Live Data Updates
```typescript
supabase.channel('table-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, handler)
  .subscribe()
```

### Presence (Online Users)
```typescript
const channel = supabase.channel('room-1')
channel.on('presence', { event: 'sync' }, () => { /* update UI */ })
channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') await channel.track({ user_id, online_at: new Date() })
})
```

## Features
- Optimistic UI updates (show change before server confirms)
- Reconnection handling with state recovery
- Presence indicators (online dot, user avatars)
- Typing indicators with debounce
- Unread count badges
- Clean up subscriptions on component unmount
