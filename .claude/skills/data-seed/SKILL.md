---
name: data-seed
description: Create seed data for development and testing
argument-hint: <target> (e.g., "users 50", "products with categories", "full demo dataset")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Data Seeding

Target: $ARGUMENTS

## Process
1. Analyze database schema (tables, relationships, constraints)
2. Generate realistic seed data respecting:
   - Foreign key relationships
   - Unique constraints
   - Data types and validation rules
   - Realistic value distributions
3. Create seed script (SQL or TypeScript)
4. Include data for all environments:
   - **Dev**: Rich dataset for development (50-100 records per table)
   - **Test**: Minimal dataset for fast test runs
   - **Demo**: Curated dataset for demos/screenshots
5. Make seeds idempotent (safe to run multiple times)
6. Include cleanup/reset function

## Data Quality
- Use realistic names, emails, dates (Faker.js)
- Proper date ranges (not all same day)
- Realistic relationships (users with posts, posts with comments)
- Edge cases (empty strings, long text, special characters, Unicode)
