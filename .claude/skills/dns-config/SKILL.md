---
name: dns-config
description: Configure DNS records — domains, subdomains, email routing, CDN
argument-hint: <domain> <action> (e.g., "example.com add CNAME www", "setup email records")
disable-model-invocation: true
allowed-tools: Read, Write, Bash
---

# DNS Configuration

Target: $ARGUMENTS

## Common Records
- **A**: Domain → IP address
- **AAAA**: Domain → IPv6 address
- **CNAME**: Subdomain → another domain (www → app.vercel.app)
- **MX**: Email routing (priority + mail server)
- **TXT**: Verification, SPF, DKIM, DMARC
- **NS**: Nameserver delegation

## Email DNS (SPF + DKIM + DMARC)
```
@ TXT "v=spf1 include:_spf.google.com ~all"
google._domainkey CNAME google._domainkey.your-domain.com
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com"
```

## Vercel DNS
```
@ A 76.76.21.21
www CNAME cname.vercel-dns.com
```
