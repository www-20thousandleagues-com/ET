---
name: secret-rotate
description: Rotate API keys, tokens, and secrets with zero downtime
argument-hint: <secret-name> (e.g., "Stripe API key", "Supabase service key", "JWT secret")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Bash, Edit
---

# Secret Rotation

Secret: $ARGUMENTS

## Process
1. Generate new secret/key from the provider
2. Add new secret to environment (don't remove old yet)
3. Update application code to use new secret
4. Deploy with new secret
5. Verify application works with new secret
6. Revoke/delete old secret
7. Update documentation

## Zero-Downtime Pattern
- Support both old and new secrets simultaneously during transition
- Use environment variable naming: `{SECRET}_V2` during migration
- Or: accept multiple keys and try each until one works

## Secrets Checklist
- [ ] Supabase anon key and service role key
- [ ] Stripe secret key and webhook signing secret
- [ ] OAuth client secrets (Google, GitHub, etc.)
- [ ] JWT signing secret
- [ ] Email service API key
- [ ] Any third-party API keys
