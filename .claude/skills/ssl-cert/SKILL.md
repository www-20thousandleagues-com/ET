---
name: ssl-cert
description: Configure SSL/TLS certificates — provision, renew, troubleshoot
argument-hint: <domain> <action> (e.g., "example.com provision", "*.example.com wildcard")
disable-model-invocation: true
allowed-tools: Read, Bash, Write
---

# SSL Certificate

Target: $ARGUMENTS

## Automatic (Recommended)
- **Vercel**: Automatic provisioning and renewal for custom domains
- **Cloudflare**: Free Universal SSL, one-click setup
- **Let's Encrypt**: Free, auto-renewal via certbot

## Troubleshooting
- Check certificate: `openssl s_client -connect example.com:443 -servername example.com`
- Verify chain: `curl -vI https://example.com 2>&1 | grep -i 'SSL\|certificate'`
- Check expiry: `echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates`

## Common Issues
- Mixed content (HTTP resources on HTTPS page)
- Certificate chain incomplete
- Wildcard certificate doesn't cover apex domain
- Redirect loop (HTTP → HTTPS → HTTP)
