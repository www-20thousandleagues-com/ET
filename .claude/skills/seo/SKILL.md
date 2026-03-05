---
name: seo
description: Optimize pages for search engines — meta tags, structured data, sitemap, performance
argument-hint: <action> (e.g., "audit homepage", "add meta tags", "generate sitemap")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# SEO Optimization

Action: $ARGUMENTS

## On-Page SEO Checklist
- [ ] Unique `<title>` tag (50-60 chars) per page
- [ ] Meta description (150-160 chars) per page
- [ ] Open Graph tags (og:title, og:description, og:image, og:url)
- [ ] Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- [ ] Canonical URL tag
- [ ] Proper heading hierarchy (single H1, H2s for sections)
- [ ] Descriptive link text (no "click here")
- [ ] Alt text on all images
- [ ] Structured data (JSON-LD) where applicable

## Technical SEO
- [ ] XML sitemap generation
- [ ] robots.txt configuration
- [ ] Clean URL structure
- [ ] Proper 301 redirects for moved content
- [ ] Fast page load (< 3s on 3G)
- [ ] Mobile-friendly responsive design
- [ ] HTTPS everywhere
- [ ] No duplicate content
- [ ] Proper handling of SPA routing for crawlers
