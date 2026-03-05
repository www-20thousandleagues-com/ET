---
name: deploy
description: Build, verify, and deploy the application
argument-hint: [environment] (e.g., "staging" or "production")
disable-model-invocation: true
allowed-tools: Bash, Read, Grep
---

# Deploy

Deploy to: $ARGUMENTS

## Process
1. Run `cd ET && pnpm build` — verify build succeeds with zero errors
2. Check for TypeScript errors: `cd ET && npx tsc --noEmit`
3. Run tests if configured: `cd ET && pnpm test`
4. Check git status — ensure working tree is clean
5. Verify current branch and latest commit
6. Deploy based on target:
   - **Vercel**: `vercel --prod` or `vercel` for preview
   - **Supabase Edge Functions**: `supabase functions deploy`
   - **Custom**: Follow project-specific deploy scripts
7. Verify deployment is live and healthy

## Safety
- NEVER deploy with uncommitted changes
- ALWAYS verify build passes before deploying
- Ask for confirmation before production deploys
