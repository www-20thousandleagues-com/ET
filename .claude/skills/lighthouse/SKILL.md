---
name: lighthouse
description: Run and analyze Lighthouse performance audits — Core Web Vitals, accessibility, SEO, best practices
argument-hint: [url-or-page] (optional)
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Edit
---

# Lighthouse Audit

Target: $ARGUMENTS

## Run Audit
- Use Playwright MCP to load page and capture metrics
- Or: `npx lighthouse <url> --output=json --output-path=./lighthouse.json`

## Score Categories
- **Performance** (target: 90+): LCP, FID/INP, CLS, TTFB, TBT
- **Accessibility** (target: 100): ARIA, contrast, labels, focus
- **Best Practices** (target: 100): HTTPS, no console errors, image aspect ratios
- **SEO** (target: 100): Meta tags, crawlability, mobile-friendly

## Common Fixes by Category
### Performance
- Optimize LCP: preload hero image, reduce server time
- Fix CLS: set dimensions on images/embeds, avoid layout shifts
- Reduce TBT: code split, defer non-critical JS

### Accessibility
- Add alt text, fix contrast, add labels

### Best Practices
- Use HTTPS, add CSP headers, fix console errors

### SEO
- Add meta description, ensure mobile viewport, add structured data
