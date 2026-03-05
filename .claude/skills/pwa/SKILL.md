---
name: pwa
description: Convert app to Progressive Web App — offline support, install prompt, push notifications
argument-hint: <action> (e.g., "setup PWA", "add offline support", "add push notifications")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Progressive Web App

Action: $ARGUMENTS

## PWA Setup
1. Create `manifest.json` with app metadata, icons, theme colors
2. Register service worker (use Workbox via vite-plugin-pwa)
3. Configure caching strategies:
   - **Cache First**: Static assets (JS, CSS, images, fonts)
   - **Network First**: API calls, dynamic content
   - **Stale While Revalidate**: Semi-static content
4. Add install prompt UI
5. Handle offline fallback page
6. Add app icons in all required sizes (192x192, 512x512)

## Vite PWA Plugin
```bash
pnpm add -D vite-plugin-pwa
```

## Features
- Offline support with meaningful fallback
- Background sync for failed requests
- Push notification support
- App install banner/prompt
- Splash screen configuration
- Periodic cache updates
