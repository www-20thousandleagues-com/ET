---
name: routing
description: Set up or extend routing — pages, layouts, guards, navigation
argument-hint: <action> (e.g., "setup React Router", "add auth guard", "add nested routes")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Routing

Action: $ARGUMENTS

## React Router Setup
1. Install: `pnpm add react-router-dom`
2. Create route configuration
3. Set up layout routes (shared headers, sidebars)
4. Add lazy loading for route components
5. Add route guards for protected pages
6. Handle 404/not found

## Route Structure
```
/                    → Home/Dashboard
/auth/login          → Login page
/auth/signup         → Signup page
/dashboard           → Dashboard (protected)
/settings            → User settings (protected)
/settings/profile    → Profile settings
/settings/billing    → Billing settings
/:slug               → Dynamic page
```

## Features
- Code splitting per route (React.lazy)
- Loading indicators during route transitions
- Scroll restoration
- Route-based breadcrumbs
- Protected route wrapper (redirect to login if unauthenticated)
- Role-based route access
