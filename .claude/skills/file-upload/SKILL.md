---
name: file-upload
description: Build file upload functionality — drag-drop, preview, progress, storage
argument-hint: <type> <destination> (e.g., "image avatar Supabase Storage", "document PDF S3")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit
---

# File Upload

Create: $ARGUMENTS

## Using Supabase Storage
1. Create storage bucket with access policies
2. Build upload component with:
   - Drag and drop zone
   - File type validation (MIME type + extension)
   - File size limit enforcement
   - Image preview before upload
   - Upload progress bar
   - Cancel upload capability
   - Multiple file support
3. Generate signed URLs for secure access
4. Handle image optimization (resize, compress)

## Component Features
- Drag & drop with visual feedback
- Click to browse fallback
- File type and size validation with error messages
- Image preview with crop/rotate (for avatars)
- Upload progress indicator
- Retry failed uploads
- Remove uploaded files
- Accessible: keyboard operable, screen reader announcements
