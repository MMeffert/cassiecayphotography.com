# External Integrations

**Analysis Date:** 2025-01-19

## APIs & External Services

**Google reCAPTCHA Enterprise:**
- Purpose: Bot/spam protection for contact form
- SDK/Client: Native `fetch` API (Node.js 24)
- Auth: API key stored in AWS Secrets Manager
- Configuration:
  - Project ID: `cassiecayphotographycom`
  - Site Key: `6LchXjYsAAAAANiJ_B8AKMUp7vwsJx_8HnKLBzr2`
  - Score Threshold: 0.5
- Files: `infrastructure/lambda/contact-form/index.js`, `index.html`

**Google Analytics (GA4):**
- Purpose: Website analytics
- Measurement ID: `G-TQDYZMGR2H`
- Integration: gtag.js script in `index.html`
- No backend integration

**Google Fonts:**
- Purpose: Typography (Muli font family)
- Loaded from: `fonts.googleapis.com`
- File: `index.html`

**Adobe Fonts (Typekit):**
- Purpose: Typography (liebegerda font)
- Kit ID: `xzi7yjp`
- File: `index.html`

**Appointy:**
- Purpose: Photography session booking
- URL: `https://booking.appointy.com/cassiecayphotography`
- Integration: External link only (no API integration)
- File: `index.html`

## AWS Services

**Amazon S3:**
- Purpose: Static site hosting
- Bucket: `cassiecayphotography.com-site-content`
- Access: CloudFront OAC (Origin Access Control)
- File: `infrastructure/lib/static-site-stack.ts`

**Amazon CloudFront:**
- Purpose: CDN, HTTPS termination
- Features: HTTP/2+3, TLS 1.2 minimum, gzip compression
- Cache: Optimized caching policy
- Error Pages: Custom 404 handling
- File: `infrastructure/lib/static-site-stack.ts`

**AWS Lambda:**
- Purpose: Contact form backend
- Function: `cassiecayphotography-website-contact-form`
- Runtime: Node.js 24.x
- Memory: 128 MB
- Timeout: 10 seconds
- URL: Function URL (no API Gateway)
- File: `infrastructure/lib/contact-form-stack.ts`

**Amazon SES:**
- Purpose: Email delivery for contact form
- Sender: `no-reply@cassiecayphotography.com`
- Recipient: `cassiecayphoto@gmail.com`
- Region: us-east-1
- File: `infrastructure/lambda/contact-form/index.js`

**AWS Secrets Manager:**
- Purpose: Store reCAPTCHA API key
- Secret Name: `cassiecayphotography-website/recaptcha-api-key`
- File: `infrastructure/lib/contact-form-stack.ts`

**Amazon Route 53:**
- Purpose: DNS management
- Hosted Zone: `cassiecayphotography.com` (Z044655929UUGAQW4PNZI)
- Records: A, AAAA for apex and www
- File: `infrastructure/lib/static-site-stack.ts`

**AWS Certificate Manager (ACM):**
- Purpose: SSL/TLS certificates
- Domains: `cassiecayphotography.com`, `www.cassiecayphotography.com`
- Validation: DNS validation via Route 53
- File: `infrastructure/lib/static-site-stack.ts`

**AWS IAM:**
- Purpose: GitHub Actions deployment permissions
- Role: `CassiePhotoGitHubActionsDeploymentRole`
- OIDC Provider: `token.actions.githubusercontent.com`
- File: `infrastructure/lib/github-oidc-stack.ts`

## Data Storage

**Databases:**
- None (static site)

**File Storage:**
- S3 bucket for static assets
- Images stored in `images/` directory

**Caching:**
- CloudFront edge caching
- Cache headers set by GitHub Actions deploy workflow

## Authentication & Identity

**GitHub OIDC (CI/CD):**
- Purpose: Keyless AWS authentication for deployments
- Provider: AWS IAM OIDC
- Repository: `MMeffert/cassiecayphotography.com`
- Role: `CassiePhotoGitHubActionsDeploymentRole`
- File: `infrastructure/lib/github-oidc-stack.ts`

**reCAPTCHA (Bot Protection):**
- Type: reCAPTCHA Enterprise (invisible)
- Action: `contact_submit`
- Score-based validation

**No user authentication** - Public website

## Monitoring & Observability

**Error Tracking:**
- Lambda CloudWatch Logs (automatic)
- Console logging in Lambda function

**Analytics:**
- Google Analytics 4 (client-side)

**No dedicated APM or error tracking service**

## CI/CD & Deployment

**Hosting:**
- AWS (S3 + CloudFront)
- Region: us-east-1

**CI Pipeline:**
- GitHub Actions
- Workflow: `.github/workflows/deploy.yml`
- Trigger: Push to `main` branch
- Features:
  - OIDC authentication (no stored credentials)
  - S3 sync with cache headers
  - CloudFront cache invalidation

**Dependency Management:**
- Dependabot (npm + GitHub Actions)
- Auto-merge for minor/patch updates
- File: `.github/dependabot.yml`

## Environment Configuration

**Required Environment Variables (Lambda):**
| Variable | Description | Source |
|----------|-------------|--------|
| `SENDER_EMAIL` | SES sender address | CDK hardcoded |
| `RECEIVER_EMAIL` | Form recipient | CDK hardcoded |
| `RECAPTCHA_API_KEY_SECRET_NAME` | Secret name | CDK |
| `RECAPTCHA_PROJECT_ID` | GCP project | CDK hardcoded |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA key | CDK hardcoded |

**Required Secrets:**
- Secrets Manager: `cassiecayphotography-website/recaptcha-api-key`
  - Must be set manually after CDK deployment

**AWS Configuration:**
- Profile: `personal`
- Account: `241654197557`
- Region: `us-east-1`

## Webhooks & Callbacks

**Incoming:**
- Lambda Function URL: `https://7qcdrfk7uctpaqw36i5z2kwxha0rgrnx.lambda-url.us-east-1.on.aws/`
  - POST only
  - CORS configured for site domains

**Outgoing:**
- reCAPTCHA Enterprise API (verification)
- SES (email delivery)

## Social Media Links

External links only (no API integration):
- Instagram: `https://www.instagram.com/cassie.cay.photography/`
- Facebook: `https://www.facebook.com/cassie.cay.photography`
- 500px: `https://500px.com/p/cassiecayphoto`

---

*Integration audit: 2025-01-19*
