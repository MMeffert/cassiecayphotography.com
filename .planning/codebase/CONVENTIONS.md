# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- CDK Stack files: `kebab-case.ts` (e.g., `static-site-stack.ts`, `github-oidc-stack.ts`, `contact-form-stack.ts`)
- CDK entry point: `infrastructure.ts` in `bin/` directory
- Lambda handlers: `index.js` in function-specific directories (e.g., `lambda/contact-form/index.js`)
- Static assets: `kebab-case` for images and CSS files

**Classes:**
- PascalCase for CDK Stack classes: `StaticSiteStack`, `GitHubOidcStack`, `ContactFormStack`
- CDK construct names use PascalCase without hyphens: `SiteBucket`, `SiteDistribution`, `ContactFormFunction`

**Functions:**
- Lambda: camelCase for function names (e.g., `getRecaptchaApiKey`, `verifyRecaptcha`, `sendEmail`)
- Lambda handler: CommonJS export `exports.handler`

**Variables:**
- camelCase for local variables and parameters
- UPPER_SNAKE_CASE for environment variables and constants (e.g., `SENDER`, `RECEIVER`, `RECAPTCHA_API_KEY_SECRET_NAME`)
- CDK construct IDs use PascalCase strings (e.g., `'SiteBucket'`, `'ContactFormFunction'`)

**Types/Interfaces:**
- PascalCase with `Props` suffix for CDK stack props: `StaticSiteStackProps`, `GitHubOidcStackProps`, `ContactFormStackProps`
- Interfaces extend `cdk.StackProps` for stack configuration

## Code Style

**Formatting:**
- No explicit formatter configured (no .prettierrc or .eslintrc)
- 2-space indentation in TypeScript files
- 4-space indentation in Lambda JavaScript files
- Single quotes for strings in TypeScript
- Mix of single and double quotes in Lambda JavaScript (prefer single quotes)

**Linting:**
- No explicit linting configured
- TypeScript strict mode enabled via `tsconfig.json`:
  - `strict: true`
  - `noImplicitAny: true`
  - `strictNullChecks: true`
  - `noImplicitReturns: true`

## Import Organization

**Order (TypeScript/CDK):**
1. AWS CDK core: `import * as cdk from 'aws-cdk-lib';`
2. AWS CDK service modules: `import * as s3 from 'aws-cdk-lib/aws-s3';`
3. Constructs: `import { Construct } from 'constructs';`
4. Local modules (relative imports)

**Pattern:**
```typescript
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Construct } from 'constructs';
```

**Lambda (CommonJS):**
```javascript
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
```

**Path Aliases:**
- None configured; use relative paths

## Error Handling

**Lambda Patterns:**
- Try/catch blocks around async operations
- Return structured JSON responses with `statusCode`, `headers`, and `body`
- Log errors with `console.error()` including message and stack trace
- User-facing errors use generic messages ("reCAPTCHA service error", "Email service error")
- Internal logging includes detailed error information

**Example pattern from `infrastructure/lambda/contact-form/index.js`:**
```javascript
try {
    const result = await someOperation();
    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: 'Success' })
    };
} catch (error) {
    console.error('Operation error:', error.message);
    console.error('Operation error stack:', error.stack);
    return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result: 'Failed', reason: 'Service error' })
    };
}
```

## Logging

**Framework:** Native `console` methods

**Lambda Patterns:**
- `console.log()` for informational messages and success responses
- `console.error()` for error conditions with message and stack
- Log incoming events: `console.log('Received event:', JSON.stringify(event));`
- Log external API responses for debugging

## Comments

**When to Comment:**
- Inline comments for configuration explanations (e.g., `// Required for CloudFront + ACM`)
- TODO comments for future work: `// TODO: Set to false after migrating from old infrastructure`
- JSDoc-style comments for interface properties in CDK props

**JSDoc/TSDoc:**
- Used sparingly for interface property documentation
- Multi-line `/**` comments for complex props:
```typescript
/**
 * Skip domain setup (certificate, aliases, DNS records).
 * Use this for initial deployment when migrating from existing infrastructure.
 */
skipDomainSetup?: boolean;
```

## Function Design

**Size:**
- Functions are focused and single-purpose
- Lambda handlers coordinate multiple helper functions

**Parameters:**
- CDK stacks receive a single `props` object extending `StackProps`
- Lambda helper functions use destructured parameters where appropriate

**Return Values:**
- CDK constructs assigned to class properties for export: `public readonly bucket: s3.Bucket;`
- Lambda returns structured response objects
- Async functions return Promises

## Module Design

**Exports:**
- CDK: Named exports for Stack classes and Props interfaces
- Lambda: CommonJS `exports.handler` for entry point

**CDK Stack Pattern:**
```typescript
export interface MyStackProps extends cdk.StackProps {
  // Custom props
}

export class MyStack extends cdk.Stack {
  public readonly resource: SomeType;

  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);
    // Implementation
  }
}
```

**Barrel Files:**
- Not used; each stack is a separate module imported directly

## CDK-Specific Patterns

**Tagging:**
- Apply standard tags at stack level using `cdk.Tags.of(this).add()`:
```typescript
cdk.Tags.of(this).add('Application', 'cassiecayphotography');
cdk.Tags.of(this).add('Environment', 'production');
cdk.Tags.of(this).add('ManagedBy', 'cdk');
cdk.Tags.of(this).add('Repository', 'MMeffert/cassiecayphotography.com');
```

**Outputs:**
- Use `cdk.CfnOutput` for important values
- Include `description` and `exportName` for cross-stack references

**Resource Naming:**
- Explicit resource names for important resources: `bucketName`, `functionName`, `roleName`
- Let CDK generate names for internal constructs

**Security:**
- S3: `blockPublicAccess: BlockPublicAccess.BLOCK_ALL`, `enforceSSL: true`
- IAM: Least-privilege policies with specific resource ARNs where possible
- Lambda: Function URLs with CORS restrictions

## Frontend JavaScript

**Style:**
- jQuery-based with `'use strict'` directive
- Uses template theme code (Revolution Slider, Swiper, etc.)
- Inline scripts in `index.html` for form submission

**Contact Form Pattern:**
```javascript
function submitToAPI(e) {
    e.preventDefault();
    // Validation
    // Disable button and show loading state
    // Execute reCAPTCHA and submit via AJAX
}
```

---

*Convention analysis: 2026-01-19*
