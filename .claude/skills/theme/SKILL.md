---
name: theme
description: Create, modify, or extend application themes
argument-hint: <action> (e.g., "add cyberpunk theme", "customize dark mode", "add brand colors")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Theme

Action: $ARGUMENTS

## Theme System
- Uses `next-themes` with `class` attribute strategy
- CSS custom properties for color tokens
- Tailwind `dark:` variant for dark mode styles

## Process
1. Define color palette (HSL format for Tailwind compatibility)
2. Create CSS custom properties in theme CSS file
3. Map to Tailwind theme config
4. Update component styles to use theme tokens
5. Test both light and dark modes
6. Verify contrast ratios meet WCAG AA (4.5:1 for text, 3:1 for large text)

## Theme Structure
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 3.9%;
  --primary: 0 0% 9%;
  /* ... */
}
.dark {
  --background: 0 0% 3.9%;
  --foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  /* ... */
}
```
