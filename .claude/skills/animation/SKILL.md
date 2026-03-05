---
name: animation
description: Add animations and transitions to components
argument-hint: <component-or-pattern> <animation-type> (e.g., "Card entrance fade-slide-up")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit
---

# Animation

Target: $ARGUMENTS

## Animation Libraries Available
- **Motion** (Framer Motion) — Complex animations, gestures, layout transitions
- **tw-animate-css** — Simple CSS animations via Tailwind classes
- **CSS Transitions** — Simple state changes (hover, focus, open/close)

## Animation Patterns
- **Entrance**: fade-in, slide-up, scale-in, stagger children
- **Exit**: fade-out, slide-down, scale-out
- **Hover**: scale, shadow elevation, color shift
- **Loading**: skeleton pulse, spinner, progress bar
- **Layout**: shared layout animations, reorder, resize
- **Scroll**: parallax, reveal on scroll, sticky headers
- **Page transitions**: crossfade, slide between routes
- **Micro-interactions**: button press, toggle, checkbox check

## Rules
- Respect `prefers-reduced-motion` — disable animations for accessibility
- Keep durations under 300ms for UI feedback, 500ms for page transitions
- Use `ease-out` for entrances, `ease-in` for exits
- Never block user interaction with animations
- Test at 0.25x speed to verify smoothness
