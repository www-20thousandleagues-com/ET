---
name: test
description: Write comprehensive tests for a component or module
argument-hint: <file-path-or-component-name>
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Write Tests

Write tests for: $ARGUMENTS

## Process
1. Read the target file/component to understand its behavior
2. Identify all testable behaviors, edge cases, and error paths
3. Check existing test patterns in the project for consistency
4. Write tests covering:
   - Happy path / normal usage
   - Edge cases (empty, null, boundary values)
   - Error states and error handling
   - User interactions (click, type, submit)
   - Accessibility (role queries, keyboard events)
5. Run tests to verify they pass
6. Ensure no flaky tests — mock external dependencies

## Conventions
- Use Vitest + React Testing Library (if configured)
- Test files: `ComponentName.test.tsx` colocated with component
- Describe blocks mirror component/function structure
- Use `screen.getByRole` over `getByTestId` when possible
- Mock API calls, never hit real endpoints
