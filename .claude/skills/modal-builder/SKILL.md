---
name: modal-builder
description: Build a modal/dialog with proper accessibility and animations
argument-hint: <modal-name> <purpose> (e.g., "ConfirmDelete confirm destructive action")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Modal Builder

Create: $ARGUMENTS

## Using shadcn/ui Dialog
- `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`
- For destructive actions, use `AlertDialog` variant
- For side panels, use `Sheet` component (Vaul drawer on mobile)

## Requirements
- Focus trap within modal
- Close on Escape key
- Close on backdrop click (unless destructive)
- Smooth enter/exit animations via Motion
- Prevent body scroll when open
- Return focus to trigger on close
- Responsive: full-screen on mobile, centered on desktop
- Loading state on async actions within modal
- Error handling with inline messages
