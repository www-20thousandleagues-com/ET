---
name: websocket
description: Implement WebSocket connections for real-time bidirectional communication
argument-hint: <feature> (e.g., "chat room", "live collaboration", "real-time notifications")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# WebSocket Implementation

Feature: $ARGUMENTS

## Using Supabase Realtime (Preferred)
- Built-in WebSocket support via Supabase channels
- Broadcast, Presence, and Postgres Changes
- Auto-reconnection and state recovery

## Custom WebSocket (if needed)
```typescript
// Hook for WebSocket connection
function useWebSocket(url: string) {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState<'connecting'|'open'|'closed'>('connecting')
  const wsRef = useRef<WebSocket>()

  useEffect(() => {
    const ws = new WebSocket(url)
    ws.onopen = () => setStatus('open')
    ws.onmessage = (e) => setMessages(prev => [...prev, JSON.parse(e.data)])
    ws.onclose = () => { setStatus('closed'); /* reconnect logic */ }
    wsRef.current = ws
    return () => ws.close()
  }, [url])

  const send = (data: unknown) => wsRef.current?.send(JSON.stringify(data))
  return { messages, status, send }
}
```

## Features
- Automatic reconnection with exponential backoff
- Heartbeat/ping-pong to detect dead connections
- Message queuing during disconnection
- Connection status indicator in UI
- Message ordering guarantees
