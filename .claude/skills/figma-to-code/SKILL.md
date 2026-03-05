---
name: figma-to-code
description: Convert Figma designs to React components with pixel-perfect accuracy
argument-hint: <design-reference> (e.g., "Figma URL", "screenshot path", "component name from design")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Figma to Code

Design: $ARGUMENTS

## Process
1. Analyze the design (screenshot, Figma MCP, or description)
2. Identify component breakdown:
   - Layout structure (flex/grid)
   - Reusable components vs one-off elements
   - Interactive states (hover, active, focus, disabled)
   - Responsive behavior
3. Map to existing shadcn/ui components where possible
4. Build components with:
   - Tailwind CSS matching design specs exactly
   - Proper spacing (use design system scale)
   - Correct typography (font, size, weight, color, line-height)
   - Color tokens from design system
   - Dark mode variant
5. Add interactivity (click handlers, state, animations)
6. Verify visual match at all breakpoints

## Rules
- Use existing ui/ components as building blocks
- Match spacing to 4px grid
- Use design system color tokens, not hardcoded hex values
- Include all states: default, hover, active, focus, disabled, loading
- Add proper cursor styles for interactive elements
