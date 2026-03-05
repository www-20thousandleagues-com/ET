---
name: layout
description: Create page layouts — grids, sidebars, headers, footers, responsive structures
argument-hint: <layout-type> (e.g., "dashboard with sidebar", "landing page", "split view")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Layout Builder

Create: $ARGUMENTS

## Layout Patterns
- **App Shell**: Fixed header + sidebar + scrollable content area
- **Dashboard**: Header + sidebar + grid of cards/widgets
- **Landing Page**: Hero + features + pricing + CTA + footer
- **Split View**: Resizable panels (react-resizable-panels)
- **Masonry**: Pinterest-style grid (react-responsive-masonry)
- **Holy Grail**: Header + 3-column + footer
- **Sticky Sidebar**: Content scrolls, sidebar stays fixed

## Implementation
- Tailwind CSS Flexbox/Grid for layout
- `react-resizable-panels` for split views
- Mobile-first responsive design
- Breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
- Use semantic HTML: `<header>`, `<main>`, `<aside>`, `<nav>`, `<footer>`
- Support dark mode via `dark:` variants
- Handle overflow with scroll areas (shadcn/ui ScrollArea)
