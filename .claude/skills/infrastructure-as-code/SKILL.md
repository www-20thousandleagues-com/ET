---
name: infrastructure-as-code
description: Define infrastructure as code — Terraform, Pulumi, CloudFormation, Docker Compose
argument-hint: <tool> <resources> (e.g., "terraform VPC + RDS", "docker-compose full stack", "pulumi S3 + CloudFront")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Infrastructure as Code

Create: $ARGUMENTS

## Terraform
```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
}

resource "aws_s3_bucket" "assets" {
  bucket = "myapp-assets"
}
```

## Docker Compose (Local Development)
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    volumes: ["./src:/app/src"]
    environment:
      - SUPABASE_URL=${SUPABASE_URL}
  db:
    image: postgres:16-alpine
    volumes: ["pgdata:/var/lib/postgresql/data"]
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
```

## Best Practices
- Version control all infrastructure code
- Use variables for environment-specific values
- State management (Terraform state, lock files)
- Plan before apply — review changes
- Modularize reusable components
- Tag all resources for cost tracking
- Use least-privilege IAM policies
