---
name: meta-tags
description: Add or update HTML meta tags for SEO, social sharing, and browser behavior
argument-hint: <page> (e.g., "homepage", "all pages", "blog post template")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Edit, Write
---

# Meta Tags

Page: $ARGUMENTS

## Essential Meta Tags
```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Page Title — Site Name</title>
<meta name="description" content="150-160 char description" />
<link rel="canonical" href="https://example.com/page" />
<meta name="robots" content="index, follow" />
```

## React Helmet / Document Head
- Use `react-helmet-async` or direct DOM manipulation
- Dynamic meta tags per route
- Template: `{pageTitle} — {siteName}`
- Unique description per page
