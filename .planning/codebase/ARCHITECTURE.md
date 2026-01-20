# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Static Site with Serverless Backend

**Key Characteristics:**
- Single-page static HTML website served via CDN
- Infrastructure-as-Code using AWS CDK v2 (TypeScript)
- Serverless contact form using AWS Lambda with Function URL
- GitHub Actions CI/CD pipeline with OIDC authentication
- No build step for frontend - static assets served directly

## Layers

**Presentation Layer (Static Frontend):**
- Purpose: Photography portfolio website displayed to visitors
- Location: `/index.html`, `/images/`, `/style/`
- Contains: HTML, CSS, JavaScript, images
- Depends on: CDN (CloudFront), jQuery, Bootstrap, Revolution Slider
- Used by: End users via browser

**Infrastructure Layer (CDK):**
- Purpose: Define and provision AWS resources
- Location: `/infrastructure/`
- Contains: CDK stacks (TypeScript), Lambda code (JavaScript)
- Depends on: AWS CDK, aws-cdk-lib, constructs
- Used by: Developers deploying infrastructure

**Backend Layer (Lambda):**
- Purpose: Handle contact form submissions
- Location: `/infrastructure/lambda/contact-form/`
- Contains: Node.js Lambda handler
- Depends on: AWS SDK (SES, Secrets Manager), Google reCAPTCHA Enterprise API
- Used by: Frontend contact form via HTTP POST

**CI/CD Layer (GitHub Actions):**
- Purpose: Automate deployments on git push
- Location: `/.github/workflows/`
- Contains: Workflow YAML files
- Depends on: GitHub Actions, AWS OIDC provider
- Used by: Git push events to main branch

## Data Flow

**Static Content Delivery:**

1. User requests cassiecayphotography.com
2. Route 53 resolves to CloudFront distribution
3. CloudFront serves cached content or fetches from S3 origin
4. S3 returns HTML/CSS/JS/images via Origin Access Control (OAC)
5. CloudFront caches and delivers to user

**Contact Form Submission:**

1. User fills form on `/index.html`
2. JavaScript executes reCAPTCHA Enterprise (invisible)
3. AJAX POST to Lambda Function URL with form data + reCAPTCHA token
4. Lambda verifies reCAPTCHA token via Google API
5. Lambda retrieves API key from Secrets Manager
6. If valid, Lambda sends email via SES
7. Response returned to frontend

**Deployment Flow:**

1. Developer pushes to `main` branch
2. GitHub Actions triggered (path filtering excludes infrastructure/)
3. OIDC authenticates with AWS (assumes deployment role)
4. S3 sync uploads changed files
5. CloudFront cache invalidated

**State Management:**
- No application state - purely static content
- Contact form is stateless (no database)
- Infrastructure state managed by CloudFormation (CDK)

## Key Abstractions

**CDK Stacks:**
- Purpose: Logical groupings of related AWS resources
- Examples:
  - `infrastructure/lib/static-site-stack.ts` - S3, CloudFront, Route 53, ACM
  - `infrastructure/lib/github-oidc-stack.ts` - IAM roles for GitHub Actions
  - `infrastructure/lib/contact-form-stack.ts` - Lambda, Function URL, Secrets Manager
- Pattern: Each stack is independent and exports values for cross-stack references

**Revolution Slider:**
- Purpose: Image carousel/slideshow on homepage
- Examples: `style/revolution/` directory
- Pattern: Third-party jQuery plugin with extensive configuration

## Entry Points

**User Entry (Browser):**
- Location: `/index.html`
- Triggers: HTTP GET request
- Responsibilities: Render full single-page site

**Contact Form Handler:**
- Location: `/infrastructure/lambda/contact-form/index.js`
- Triggers: HTTP POST from frontend JavaScript
- Responsibilities: Validate reCAPTCHA, send email via SES

**CDK Entry:**
- Location: `/infrastructure/bin/infrastructure.ts`
- Triggers: `cdk deploy` or `cdk synth`
- Responsibilities: Instantiate all CDK stacks

**CI/CD Entry:**
- Location: `/.github/workflows/deploy.yml`
- Triggers: Push to main (excluding infrastructure/** paths)
- Responsibilities: Sync site content to S3, invalidate CloudFront

## Error Handling

**Strategy:** Fail gracefully with user feedback

**Patterns:**
- CloudFront 404/403 errors redirect to `/index.html` (SPA-style)
- Contact form shows error messages in UI via jQuery
- Lambda returns structured JSON errors with HTTP status codes
- reCAPTCHA failures return 400 with reason

**Lambda Error Responses:**
```javascript
{
  statusCode: 400|500,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ result: 'Failed', reason: 'specific error message' })
}
```

## Cross-Cutting Concerns

**Logging:**
- Lambda logs to CloudWatch (console.log)
- No frontend logging beyond browser console

**Validation:**
- Frontend: JavaScript regex for name/email
- Backend: reCAPTCHA score threshold (0.5)

**Authentication:**
- GitHub Actions: OIDC with federated principal
- Lambda Function URL: No auth (public), protected by reCAPTCHA
- S3: Private bucket, CloudFront OAC only

**Caching:**
- Static assets: 1 year (immutable)
- HTML: 5 minutes (max-age=300)
- CloudFront invalidation on deploy

**Security:**
- S3 bucket: BlockPublicAccess.BLOCK_ALL, enforceSSL
- CloudFront: TLS 1.2+, HTTPS redirect
- Secrets Manager for reCAPTCHA API key
- SES sender restriction in IAM policy

---

*Architecture analysis: 2026-01-19*
