---
name: snapshot-test
description: Create snapshot tests for components — DOM snapshots and visual regression
argument-hint: <component-or-page> (e.g., "Button all variants", "Dashboard page", "all ui/ components")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Snapshot Testing

Target: $ARGUMENTS

## DOM Snapshot (Vitest)
```tsx
import { render } from '@testing-library/react'
import { Button } from './button'

it('renders default variant correctly', () => {
  const { container } = render(<Button>Click me</Button>)
  expect(container).toMatchSnapshot()
})
```

## Visual Regression (Playwright)
```typescript
test('Button visual', async ({ page }) => {
  await page.goto('/storybook/button')
  await expect(page.locator('.button')).toHaveScreenshot('button-default.png')
})
```

## When to Use Snapshots
- UI components with stable, deterministic output
- Configuration objects (API responses, schemas)
- Generated HTML/markup

## When NOT to Use
- Components with dynamic data (timestamps, random IDs)
- Large component trees (hard to review diffs)
- Tests that should verify behavior, not structure
