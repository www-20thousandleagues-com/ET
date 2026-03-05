---
name: csv-export
description: Build data export functionality — CSV, Excel, JSON, PDF
argument-hint: <data-source> <format> (e.g., "users CSV", "orders Excel", "report PDF")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Data Export

Export: $ARGUMENTS

## CSV Export (Client-Side)
```typescript
function exportToCSV(data: Record<string, unknown>[], filename: string) {
  const headers = Object.keys(data[0])
  const csv = [
    headers.join(','),
    ...data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
```

## Features
- Column selection (choose which fields to export)
- Date range filtering
- Format selection (CSV, JSON, Excel)
- Large dataset streaming (avoid memory issues)
- Progress indicator for large exports
- Server-side export for datasets > 10k rows
- Scheduled exports (daily/weekly reports)
