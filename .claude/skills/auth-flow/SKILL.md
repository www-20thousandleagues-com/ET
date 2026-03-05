---
name: auth-flow
description: Build authentication flows — login, signup, password reset, OAuth, MFA
argument-hint: <flow> (e.g., "email login", "Google OAuth", "magic link", "MFA setup")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Authentication Flow

Flow: $ARGUMENTS

## Using Supabase Auth
- Email/password signup and login
- OAuth providers (Google, GitHub, Discord, etc.)
- Magic link (passwordless email)
- Phone OTP
- Multi-factor authentication (TOTP)

## Components to Build
- Login form with email/password + social buttons
- Signup form with validation
- Password reset flow (request → email → reset form)
- Email verification notice
- MFA setup (QR code + backup codes)
- Auth guard/protected route wrapper
- Session management (auto-refresh, logout)

## Security Requirements
- Rate limit auth attempts
- Secure password requirements (min 8 chars, complexity)
- CSRF protection
- Secure session storage (httpOnly cookies preferred)
- Account lockout after failed attempts
- Audit log for auth events
- RLS policies tied to auth.uid()
