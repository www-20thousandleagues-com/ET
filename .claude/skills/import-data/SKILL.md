---
name: import-data
description: Build data import functionality — CSV upload, validation, mapping, bulk insert
argument-hint: <data-type> (e.g., "users from CSV", "products from spreadsheet", "contacts from JSON")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Data Import

Import: $ARGUMENTS

## Process
1. File upload (CSV, JSON, Excel)
2. Parse and preview first 10 rows
3. Column mapping UI (source column → database field)
4. Validation:
   - Required fields present
   - Data types correct
   - Unique constraints satisfied
   - Foreign key references valid
5. Import with progress:
   - Batch inserts (100-500 rows per batch)
   - Progress bar with count
   - Error collection (continue on error, report at end)
6. Summary report:
   - Rows imported successfully
   - Rows failed with reasons
   - Download error report

## Edge Cases
- Duplicate detection and handling (skip, update, or error)
- Unicode/encoding issues
- Empty rows/columns
- Very large files (> 100k rows) — stream processing
- Malformed data recovery
