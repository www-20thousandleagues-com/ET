---
name: image-optimize
description: Optimize images for web — compression, format conversion, responsive srcsets
argument-hint: <scope> (e.g., "all public images", "avatar uploads", "hero images")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Image Optimization

Scope: $ARGUMENTS

## Strategies
1. **Format**: Convert to WebP/AVIF (30-50% smaller than JPEG/PNG)
2. **Compression**: Lossy for photos (80% quality), lossless for icons/logos
3. **Responsive**: Generate multiple sizes for srcset
4. **Lazy Loading**: `loading="lazy"` on below-fold images
5. **Placeholder**: Low-quality blur placeholder (LQIP) while loading
6. **CDN**: Serve from edge locations
7. **SVG**: Use SVG for icons and illustrations (vector, infinitely scalable)

## Implementation
- `<img>` with `srcset` and `sizes` for responsive images
- Supabase Storage image transformations (resize, crop, format)
- Sharp (Node.js) for server-side processing
- Lazy loading with intersection observer
- Blur-up placeholder technique
- Appropriate alt text for all images
