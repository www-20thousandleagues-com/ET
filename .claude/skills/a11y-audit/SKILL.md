---
name: a11y-audit
description: Comprehensive accessibility audit — WCAG 2.1 AA compliance check and fix
argument-hint: [path-or-component] (optional — defaults to entire app)
disable-model-invocation: true
context: fork
agent: Explore
---

# Accessibility Audit

Scope: $ARGUMENTS

## WCAG 2.1 AA Checklist
### Perceivable
- [ ] All images have descriptive alt text
- [ ] Color is not the only means of conveying information
- [ ] Contrast ratios: 4.5:1 text, 3:1 large text, 3:1 UI components
- [ ] Content reflows at 400% zoom without horizontal scrolling
- [ ] Text can be resized to 200% without loss of function

### Operable
- [ ] All functionality keyboard-accessible (Tab, Enter, Space, Escape, Arrow keys)
- [ ] Visible focus indicators on all interactive elements
- [ ] No keyboard traps
- [ ] Skip-to-content link
- [ ] Page titles are descriptive and unique
- [ ] Focus order matches visual order

### Understandable
- [ ] Language attribute set on html element
- [ ] Form inputs have visible labels
- [ ] Error messages are descriptive and associated with inputs
- [ ] Consistent navigation patterns across pages

### Robust
- [ ] Valid semantic HTML (proper heading hierarchy, landmarks)
- [ ] ARIA roles/properties used correctly
- [ ] Custom components expose proper roles and states
- [ ] Works with screen readers (VoiceOver, NVDA, JAWS)

## Automated Tools
- Check with Playwright accessibility snapshots
- axe-core automated checks if configured
