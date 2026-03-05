---
name: video-process
description: Handle video upload, processing, transcoding, and streaming
argument-hint: <action> (e.g., "upload and transcode", "generate thumbnails", "HLS streaming")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Video Processing

Action: $ARGUMENTS

## Upload Flow
1. Client uploads to Supabase Storage (or direct-to-S3 presigned URL)
2. Trigger processing pipeline (webhook or queue)
3. Transcode to web-optimized formats (H.264 + AAC)
4. Generate thumbnail at key frames
5. Create HLS/DASH manifest for adaptive streaming
6. Update database with processed video metadata

## Tools
- **FFmpeg**: Server-side transcoding (via Edge Function or dedicated service)
- **Mux**: Managed video API (upload, transcode, stream, analytics)
- **Cloudflare Stream**: Edge-optimized video delivery
- **Supabase Storage**: Simple file storage for small videos

## Video Player Component
- HTML5 `<video>` with HLS.js for adaptive streaming
- Custom controls (play, pause, seek, volume, fullscreen, speed)
- Loading state with poster image
- Keyboard shortcuts (space, arrows, f for fullscreen)
- Responsive container (maintain aspect ratio)
