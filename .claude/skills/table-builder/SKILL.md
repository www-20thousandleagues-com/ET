---
name: table-builder
description: Build a data table with sorting, filtering, pagination, and selection
argument-hint: <table-name> <columns...> (e.g., "UsersTable name email role status createdAt")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Table Builder

Create: $ARGUMENTS

## Features to Include
- Column sorting (ascending/descending/none)
- Column filtering (text search, select, date range)
- Pagination with configurable page size
- Row selection (single or multi)
- Responsive: horizontal scroll on mobile, full table on desktop
- Loading skeleton state
- Empty state with call-to-action
- Bulk actions toolbar (when rows selected)
- Column visibility toggle
- Export to CSV option

## Implementation
- Use shadcn/ui `Table` component as base
- TanStack Table (install if needed) for headless table logic
- Tailwind for styling
- URL params for persisting sort/filter/page state
