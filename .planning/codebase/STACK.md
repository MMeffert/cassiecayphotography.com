# Technology Stack

**Analysis Date:** 2025-01-19

## Languages

**Primary:**
- TypeScript 5.9 - CDK infrastructure code (`infrastructure/bin/`, `infrastructure/lib/`)
- JavaScript ES2020 - Lambda function (`infrastructure/lambda/contact-form/index.js`)
- HTML5 - Static website (`index.html`)
- CSS3 - Styling (`style/style.css`, `style/css/`)

**Secondary:**
- JSON - Configuration files (`package.json`, `tsconfig.json`, `cdk.json`)

## Runtime

**Environment:**
- Node.js 24.x - Lambda runtime (specified in `infrastructure/lib/contact-form-stack.ts`)
- Browser - Static site (jQuery-based)

**Package Manager:**
- npm - Infrastructure dependencies
- Lockfile: `infrastructure/package-lock.json` (present)

## Frameworks

**Core:**
- AWS CDK v2.170.0 - Infrastructure as Code (`infrastructure/package.json`)
- Bootstrap - Frontend CSS framework (`style/css/bootstrap.min.css`)
- jQuery - DOM manipulation and AJAX (`style/js/jquery.min.js`)

**UI Components:**
- Revolution Slider - Image slider/carousel (`style/revolution/`)
- Swiper - Content slider (`index.html`)
- Cubeportfolio - Image gallery filtering (`index.html`)
- LightGallery - Image lightbox (`index.html`)

**Build/Dev:**
- ts-node - TypeScript execution for CDK (`cdk.json`)
- TypeScript - Type checking and compilation

## Key Dependencies

**CDK Infrastructure (`infrastructure/package.json`):**
```json
{
  "dependencies": {
    "aws-cdk-lib": "^2.170.0",
    "constructs": "^10.3.0"
  },
  "devDependencies": {
    "@types/node": "^25.0.3",
    "aws-cdk": "^2.170.0",
    "typescript": "~5.9.3"
  }
}
```

**Lambda Runtime (built-in to Node.js 24):**
- `@aws-sdk/client-ses` - Email sending
- `@aws-sdk/client-secrets-manager` - Secrets retrieval
- Native `fetch` - HTTP requests (Node.js 24 native)

**Frontend (loaded via CDN/local):**
- jQuery 3.x - `style/js/jquery.min.js`
- Bootstrap 4.x - `style/css/bootstrap.min.css`
- Google reCAPTCHA Enterprise - `https://www.google.com/recaptcha/enterprise.js`
- Google Fonts (Muli) - `https://fonts.googleapis.com/css?family=Muli`
- Adobe Fonts (Typekit) - `https://use.typekit.net/xzi7yjp.css`

## Configuration

**CDK Configuration:**
- `infrastructure/cdk.json` - CDK app entry point and feature flags
- `infrastructure/cdk.context.json` - Cached context values (hosted zone ID)
- `infrastructure/tsconfig.json` - TypeScript compiler settings

**TypeScript Settings (`infrastructure/tsconfig.json`):**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "outDir": "./dist"
  }
}
```

**Environment Variables (Lambda):**
- `SENDER_EMAIL` - SES sender address
- `RECEIVER_EMAIL` - Contact form recipient
- `EMAIL_SUBJECT` - Email subject line
- `RECAPTCHA_API_KEY_SECRET_NAME` - Secrets Manager secret name
- `RECAPTCHA_PROJECT_ID` - Google Cloud project ID
- `RECAPTCHA_SITE_KEY` - reCAPTCHA site key
- `RECAPTCHA_SCORE_THRESHOLD` - Spam score threshold

## Platform Requirements

**Development:**
- Node.js 18+ (for CDK)
- AWS CLI configured with `personal` profile
- AWS Account: 241654197557

**Production:**
- AWS us-east-1 region (required for CloudFront + ACM)
- S3 - Static content hosting
- CloudFront - CDN distribution
- Lambda - Contact form backend
- SES - Email delivery
- Secrets Manager - API key storage
- Route 53 - DNS (hosted zone: Z044655929UUGAQW4PNZI)
- ACM - SSL certificates

**CDK Deployment Commands:**
```bash
export AWS_PROFILE=personal
cd infrastructure
npm install
npx cdk deploy --all
```

## Build Outputs

**CDK:**
- `infrastructure/dist/` - Compiled JavaScript
- `infrastructure/cdk.out/` - CloudFormation templates

**No build for static site** - HTML/CSS/JS served directly

---

*Stack analysis: 2025-01-19*
