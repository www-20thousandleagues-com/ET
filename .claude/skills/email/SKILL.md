---
name: email
description: Set up transactional email — templates, sending, tracking
argument-hint: <action> (e.g., "setup Resend", "create welcome template", "add password reset email")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Email System

Action: $ARGUMENTS

## Email Providers
- **Resend**: Modern API, React Email templates
- **SendGrid**: Established, high volume
- **Postmark**: Excellent deliverability
- **Supabase Auth Emails**: Built-in for auth flows

## Implementation
1. Choose provider and install SDK
2. Create Edge Function for sending
3. Build email templates (React Email or HTML)
4. Set up email types:
   - Welcome / Verification
   - Password reset
   - Invoice / Receipt
   - Notification digest
   - Marketing / Newsletter
5. Add unsubscribe handling
6. Track delivery, opens, clicks
7. Handle bounces and complaints

## Templates
- Use React Email for component-based templates
- Inline CSS for email client compatibility
- Test across clients (Gmail, Outlook, Apple Mail)
- Responsive design for mobile email clients
