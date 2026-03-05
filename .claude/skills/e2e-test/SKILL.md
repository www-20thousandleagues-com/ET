---
name: e2e-test
description: Write end-to-end browser tests with Playwright
argument-hint: <flow> (e.g., "login flow", "checkout process", "user registration")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# E2E Tests

Flow: $ARGUMENTS

## Playwright Setup
1. Install: `pnpm add -D @playwright/test`
2. Configure: `playwright.config.ts`
3. Test structure: `e2e/<flow-name>.spec.ts`

## Test Writing
- Test complete user flows, not individual components
- Use page object pattern for reusable interactions
- Test across browsers: Chromium, Firefox, WebKit
- Test responsive: mobile viewport, tablet, desktop
- Use accessibility locators: `page.getByRole()`, `page.getByLabel()`
- Screenshot comparisons for visual regression
- Network interception for API mocking
- Test both happy path and error scenarios

## Common Flows to Test
- Authentication (signup, login, logout, password reset)
- Core CRUD operations
- Navigation and routing
- Form submission with validation
- Error states and recovery
- Responsive layout at breakpoints
