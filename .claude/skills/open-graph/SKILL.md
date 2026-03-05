---
name: open-graph
description: Generate Open Graph images and social media preview cards
argument-hint: <page-or-type> (e.g., "homepage", "blog post", "user profile", "dynamic OG images")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Open Graph & Social Cards

Target: $ARGUMENTS

## Meta Tags
```html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://example.com/og-image.png" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Page Title" />
<meta name="twitter:description" content="Page description" />
<meta name="twitter:image" content="https://example.com/og-image.png" />
```

## Dynamic OG Images
- Generate per-page images using Edge Function + Satori
- Template: title, description, brand colors, logo
- Cache generated images
- Dimensions: 1200x630px (standard OG), 1200x600px (Twitter)

## Validation
- Test with Facebook Sharing Debugger
- Test with Twitter Card Validator
- Test with LinkedIn Post Inspector
- Verify images render correctly when shared
