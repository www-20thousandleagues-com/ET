---
name: sitemap
description: Generate XML sitemap and robots.txt for search engine crawling
argument-hint: <action> (e.g., "generate sitemap", "update robots.txt", "add dynamic routes")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# Sitemap & Robots.txt

Action: $ARGUMENTS

## XML Sitemap
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2026-03-05</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

## Dynamic Sitemap Generation
- Server-side function that queries all public pages
- Include all static routes
- Include all dynamic routes (blog posts, user profiles, etc.)
- Set appropriate changefreq and priority
- Update lastmod from database timestamps
- Submit to Google Search Console

## Robots.txt
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /auth/
Sitemap: https://example.com/sitemap.xml
```
