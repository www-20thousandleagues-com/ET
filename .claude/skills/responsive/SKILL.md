---
name: responsive
description: Make components/pages fully responsive across all device sizes
argument-hint: <target> (e.g., "App.tsx", "dashboard page", "all forms")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Bash
---

# Responsive Design

Target: $ARGUMENTS

## Breakpoint Strategy (Mobile-First)
- Base: Mobile (< 640px)
- `sm:` Tablet portrait (640px+)
- `md:` Tablet landscape (768px+)
- `lg:` Desktop (1024px+)
- `xl:` Large desktop (1280px+)
- `2xl:` Ultra-wide (1536px+)

## Checklist
- [ ] Touch targets minimum 44x44px on mobile
- [ ] Navigation collapses to hamburger/drawer on mobile
- [ ] Tables become card layouts on mobile
- [ ] Sidebars become bottom sheets or drawers on mobile
- [ ] Images use responsive srcset or container queries
- [ ] Font sizes scale appropriately (clamp() for fluid typography)
- [ ] Spacing reduces proportionally on smaller screens
- [ ] Modals become full-screen on mobile
- [ ] No horizontal scrolling on any breakpoint
- [ ] Test with actual device widths: 375, 414, 768, 1024, 1440
