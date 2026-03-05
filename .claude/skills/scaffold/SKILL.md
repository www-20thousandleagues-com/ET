---
name: scaffold
description: Scaffold a new component, page, or feature module
argument-hint: <type> <name> (e.g., "component UserProfile" or "page dashboard")
disable-model-invocation: true
allowed-tools: Read, Glob, Write, Bash
---

# Scaffold

Create: $ARGUMENTS

## Component Scaffold
```
src/app/components/<Name>/
├── <Name>.tsx          # Main component
├── <Name>.types.ts     # TypeScript interfaces (if complex)
├── use<Name>.ts        # Custom hook (if stateful logic)
└── <Name>.test.tsx     # Tests
```

## Rules
- Use functional components with TypeScript
- Export named exports (not default)
- Use shadcn/ui primitives from `@/app/components/ui/` for UI elements
- Use `cn()` for conditional classNames
- Include proper TypeScript props interface
- Add JSDoc for the main component
- Follow existing patterns in the codebase
- Use Tailwind CSS for styling
- Support dark mode via `dark:` variants
