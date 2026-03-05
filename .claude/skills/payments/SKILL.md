---
name: payments
description: Integrate payment processing — Stripe, subscriptions, pricing, checkout
argument-hint: <action> (e.g., "setup Stripe", "add subscription plans", "create checkout flow")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Payments Integration

Action: $ARGUMENTS

## Stripe Integration
1. Install: `@stripe/stripe-js` (client) + `stripe` (server/Edge Function)
2. Create Supabase Edge Function for server-side Stripe operations
3. Set up webhook endpoint for event processing
4. Store Stripe customer ID in user profile

## Features
- **Checkout**: Stripe Checkout or custom payment form
- **Subscriptions**: Plans with monthly/annual billing
- **Customer Portal**: Self-service subscription management
- **Webhooks**: Handle payment events (success, failure, cancellation)
- **Invoices**: Automatic invoice generation
- **Pricing Table**: Display plans with feature comparison

## Security Rules
- NEVER expose Stripe secret key on client
- Validate webhook signatures
- Use idempotency keys for payment operations
- Log all payment events for audit
- Handle edge cases: failed payments, expired cards, disputes
- PCI compliance: never handle raw card data, use Stripe Elements
