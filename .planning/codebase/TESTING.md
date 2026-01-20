# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Runner:**
- Not configured

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# No test scripts defined in package.json
```

## Test File Organization

**Location:**
- No test files exist in the project

**Naming:**
- No convention established

**Structure:**
- No test directory structure exists

## Test Status

**Current State:** No automated tests are implemented.

The project lacks:
- Unit tests for Lambda functions
- Integration tests for CDK stacks
- End-to-end tests for the contact form flow
- Snapshot tests for CDK infrastructure

## Recommended Testing Setup

If tests are added, follow these CDK and Lambda testing conventions:

### CDK Infrastructure Testing

**Framework:** Jest with `aws-cdk-lib/assertions`

**Recommended Config:**
```json
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
```

**Test File Location:**
- `infrastructure/test/*.test.ts`

**CDK Assertion Pattern:**
```typescript
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { StaticSiteStack } from '../lib/static-site-stack';

describe('StaticSiteStack', () => {
  test('creates S3 bucket with correct configuration', () => {
    const app = new cdk.App();
    const stack = new StaticSiteStack(app, 'TestStack', {
      domainName: 'example.com',
      skipDomainSetup: true,
      env: { account: '123456789012', region: 'us-east-1' }
    });

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketEncryption: {
        ServerSideEncryptionConfiguration: [
          { ServerSideEncryptionByDefault: { SSEAlgorithm: 'AES256' } }
        ]
      }
    });
  });
});
```

### Lambda Testing

**Framework:** Jest

**Recommended Config:**
```json
// lambda/jest.config.js
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**', '!**/*.test.js']
};
```

**Test File Location:**
- `infrastructure/lambda/contact-form/index.test.js`

**Lambda Test Pattern:**
```javascript
const { handler } = require('./index');

// Mock AWS SDK clients
jest.mock('@aws-sdk/client-ses', () => ({
  SESClient: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({})
  })),
  SendEmailCommand: jest.fn()
}));

jest.mock('@aws-sdk/client-secrets-manager', () => ({
  SecretsManagerClient: jest.fn(() => ({
    send: jest.fn().mockResolvedValue({ SecretString: 'test-api-key' })
  })),
  GetSecretValueCommand: jest.fn()
}));

describe('Contact Form Handler', () => {
  beforeEach(() => {
    process.env.SENDER_EMAIL = 'test@example.com';
    process.env.RECEIVER_EMAIL = 'receiver@example.com';
  });

  test('returns 400 for failed reCAPTCHA verification', async () => {
    const event = {
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test',
        message: 'Test message',
        recaptchaToken: 'invalid-token'
      })
    };

    const response = await handler(event, {});
    expect(response.statusCode).toBe(400);
  });
});
```

## Mocking

**Framework:** Jest mocks (recommended)

**What to Mock:**
- AWS SDK clients (SES, Secrets Manager)
- External API calls (reCAPTCHA Enterprise)
- Environment variables

**What NOT to Mock:**
- CDK construct creation logic
- JSON parsing/serialization

## Coverage

**Requirements:** None enforced

**Recommended Minimum:**
- 80% line coverage for Lambda functions
- CDK stacks should have at least snapshot tests

## Test Types

**Unit Tests:**
- Not implemented
- Should cover: Lambda handler logic, input validation, error handling

**Integration Tests:**
- Not implemented
- Should cover: CDK stack synthesis, Lambda + AWS service integration

**E2E Tests:**
- Not implemented
- Would require: Deployed infrastructure, actual reCAPTCHA tokens

## Test Gaps

**Critical Gaps:**
1. **Lambda handler** (`infrastructure/lambda/contact-form/index.js`)
   - No tests for input validation
   - No tests for reCAPTCHA verification logic
   - No tests for SES email sending
   - No tests for error handling paths

2. **CDK Stacks**
   - No snapshot tests for infrastructure
   - No assertion tests for security configurations
   - No tests for IAM policy correctness

3. **Contact Form Frontend**
   - No tests for form validation in `index.html`
   - No tests for AJAX submission logic

## Adding Tests

To add testing support:

1. **Install dependencies:**
```bash
cd infrastructure
npm install --save-dev jest ts-jest @types/jest
```

2. **Add to `package.json`:**
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

3. **Create `jest.config.js`:**
```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/test', '<rootDir>/lambda'],
  testMatch: ['**/*.test.ts', '**/*.test.js'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};
```

4. **Create test directory:**
```bash
mkdir -p infrastructure/test
```

---

*Testing analysis: 2026-01-19*
