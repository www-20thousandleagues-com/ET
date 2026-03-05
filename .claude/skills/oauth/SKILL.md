---
name: oauth
description: Set up OAuth provider integration — Google, GitHub, Discord, etc.
argument-hint: <provider> (e.g., "Google", "GitHub", "Discord", "Apple", "all")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# OAuth Integration

Provider: $ARGUMENTS

## Supabase OAuth Setup
1. Configure provider in Supabase Dashboard → Authentication → Providers
2. Create OAuth app in provider's developer console
3. Set redirect URL: `{SUPABASE_URL}/auth/v1/callback`
4. Store Client ID and Secret in Supabase settings
5. Implement login button in frontend

## Frontend Implementation
```typescript
const signInWithProvider = async (provider: 'google' | 'github' | 'discord') => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  })
}
```

## Auth Callback Page
- Handle the redirect from OAuth provider
- Exchange code for session
- Redirect to dashboard or intended page
- Handle errors (denied permission, expired code)

## Profile Enrichment
- Sync provider profile data (avatar, name, email)
- Handle account linking (same email, different providers)
- Handle provider-specific scopes (email, profile, repos, etc.)
