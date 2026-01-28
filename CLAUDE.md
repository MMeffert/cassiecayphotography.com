# Cassie Cay Photography - Project Instructions

## AWS Configuration

**IMPORTANT:** This is a personal project deployed to a personal AWS account, NOT a Roundhouse business account.

Before running any AWS or CDK commands, set the AWS profile:

```bash
export AWS_PROFILE=personal
```

| Setting | Value |
|---------|-------|
| AWS Account ID | 241654197557 |
| AWS Profile | `personal` |
| Region | us-east-1 |

## Infrastructure

The CDK infrastructure is in the `infrastructure/` directory.

### Deploy Infrastructure

```bash
export AWS_PROFILE=personal
cd infrastructure
npm install
npx cdk bootstrap aws://241654197557/us-east-1
npx cdk deploy --all
```

### Stacks

- `CassiePhotoGitHubOidcStack` - GitHub OIDC provider and deployment role
- `CassiePhotoStaticSiteStack` - S3, CloudFront, Route53, ACM certificate

## Deployment

The site auto-deploys via GitHub Actions when pushing to `main`. The workflow uses OIDC authentication (no AWS credentials stored in GitHub).

Manual deployment is not typically needed, but if required:

```bash
export AWS_PROFILE=personal
aws s3 sync . s3://cassiecayphotography.com-site-content \
  --exclude ".git/*" --exclude ".github/*" --exclude "infrastructure/*"
```

## Domain

- Domain: cassiecayphotography.com
- DNS: Route 53 (in personal AWS account)

## Google Analytics (GA4)

| Setting | Value |
|---------|-------|
| Measurement ID | `G-TQDYZMGR2H` |
| GA4 Property ID | 269447426 |
| GCP Quota Project | `cassiecayphotographycom` |
| Dashboard | https://analytics.google.com/analytics/web/#/a485983p269447426/reports/intelligenthome |

Use `/analytics` skill to query GA4 data via API.
