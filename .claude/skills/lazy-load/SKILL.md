---
name: lazy-load
description: Implement lazy loading for routes, components, images, and data
argument-hint: <target> (e.g., "route components", "heavy modals", "images", "below-fold content")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit
---

# Lazy Loading

Target: $ARGUMENTS

## Route-Level Code Splitting
```tsx
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Settings = React.lazy(() => import('./pages/Settings'))

// With Suspense boundary
<Suspense fallback={<PageSkeleton />}>
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/settings" element={<Settings />} />
  </Routes>
</Suspense>
```

## Component Lazy Loading
- Heavy modals/dialogs (load on first open)
- Charts and data visualization (load on scroll into view)
- Rich text editors (load on focus)
- PDF viewers (load on demand)

## Image Lazy Loading
- `loading="lazy"` attribute on `<img>`
- Intersection Observer for custom behavior
- Blur-up placeholder (LQIP)
- Progressive image loading

## Data Lazy Loading
- Infinite scroll with cursor pagination
- Load more button pattern
- Prefetch on hover for links
