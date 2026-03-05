---
name: page-builder
description: Build a complete page with layout, components, data fetching, and routing
argument-hint: <page-name> <description> (e.g., "UserProfile displays user info and settings")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Page Builder

Create: $ARGUMENTS

## Page Structure
```
src/app/pages/<PageName>/
├── <PageName>.tsx          # Page component
├── <PageName>.types.ts     # Page-specific types
├── components/             # Page-specific components
├── hooks/                  # Page-specific hooks
└── <PageName>.test.tsx     # Page tests
```

## Requirements
- SEO meta tags (title, description)
- Loading state (skeleton UI)
- Error state (with retry action)
- Empty state (with helpful message/CTA)
- Responsive layout (mobile-first)
- Dark mode support
- Breadcrumb navigation if nested
- URL params for state persistence where appropriate
- Data fetching with proper error handling
- Keyboard accessibility
