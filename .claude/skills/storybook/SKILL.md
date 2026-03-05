---
name: storybook
description: Set up Storybook or create component stories for documentation and testing
argument-hint: <action> (e.g., "setup Storybook", "add stories for Button", "document all ui/ components")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Storybook

Action: $ARGUMENTS

## Setup
```bash
cd ET && npx storybook@latest init
```

## Story Structure
```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'destructive', 'outline', 'ghost'] },
    size: { control: 'select', options: ['default', 'sm', 'lg', 'icon'] },
  },
}
export default meta

type Story = StoryObj<typeof Button>
export const Default: Story = { args: { children: 'Click me' } }
export const Destructive: Story = { args: { children: 'Delete', variant: 'destructive' } }
```

## Best Practices
- Document all props with controls
- Show all variants and sizes
- Include interactive examples
- Dark mode toggle in toolbar
- Responsive viewport switcher
- Accessibility addon for automated checks
