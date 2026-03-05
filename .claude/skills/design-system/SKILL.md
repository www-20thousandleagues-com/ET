---
name: design-system
description: Create or extend design system tokens, components, and patterns
argument-hint: <action> (e.g., "add color palette", "create spacing scale", "add typography")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Design System

Action: $ARGUMENTS

## Design Tokens (via Tailwind CSS v4)
- **Colors**: Primary, secondary, accent, destructive, muted, background, foreground
- **Typography**: Font families, sizes, weights, line heights, letter spacing
- **Spacing**: Consistent scale (4px base unit)
- **Borders**: Radius scale, border widths, border colors
- **Shadows**: Elevation scale (sm, md, lg, xl)
- **Breakpoints**: sm, md, lg, xl, 2xl
- **Animation**: Duration scale, easing functions
- **Z-index**: Layering scale (base, dropdown, sticky, modal, popover, toast)

## Component Patterns
- Use CSS custom properties for theming
- Support light/dark mode via `next-themes`
- Use `cn()` utility for conditional classes
- Follow shadcn/ui patterns for consistency
- Document with JSDoc and prop descriptions

## Output
- Update Tailwind config/CSS with new tokens
- Create/update component variants using `cva()` (class-variance-authority)
- Provide usage examples for each new token/component
