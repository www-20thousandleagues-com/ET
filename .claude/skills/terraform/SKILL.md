---
name: terraform
description: Write Terraform infrastructure code — resources, modules, state management
argument-hint: <resources> (e.g., "AWS VPC + ECS", "S3 + CloudFront", "GCP Cloud Run")
disable-model-invocation: true
allowed-tools: Read, Grep, Glob, Write, Edit, Bash
---

# Terraform

Resources: $ARGUMENTS

## Structure
```
infrastructure/
├── main.tf           # Provider config, backend
├── variables.tf      # Input variables
├── outputs.tf        # Output values
├── modules/          # Reusable modules
│   ├── networking/
│   ├── compute/
│   └── database/
├── environments/
│   ├── staging.tfvars
│   └── production.tfvars
└── terraform.tfstate  # (remote backend recommended)
```

## Commands
```bash
terraform init          # Initialize providers
terraform plan          # Preview changes
terraform apply         # Apply changes
terraform destroy       # Tear down (DANGEROUS)
```

## Best Practices
- Remote state backend (S3 + DynamoDB for locking)
- Separate state per environment
- Use modules for reusable components
- Pin provider versions
- Tag all resources
- Use data sources to reference existing resources
- Never hardcode secrets in .tf files
