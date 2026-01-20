# Architecture Patterns: Static Site CI/CD

**Domain:** Photography portfolio static site (S3 + CloudFront)
**Researched:** 2026-01-19
**Confidence:** HIGH (verified with official GitHub Action repositories)

## Executive Summary

This document outlines CI/CD architecture patterns for a photography portfolio static site. The current deployment workflow syncs files to S3 and invalidates CloudFront cache. This architecture adds validation (HTML, links, images), performance testing (Lighthouse), and notifications for non-technical stakeholders.

**Key Recommendation:** Implement a three-stage pipeline: Validate -> Deploy -> Notify. Keep validation fast (< 2 minutes) to avoid blocking frequent image updates.

## Recommended Pipeline Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         On Push to Main                                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 1: VALIDATE                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ HTML Check   │  │ Link Check   │  │ Image Check  │                   │
│  │ (proof-html) │  │ (lychee)     │  │ (custom)     │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
│  ← Runs in parallel, ~30-60 seconds →                                    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                          If all pass │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 2: DEPLOY (existing workflow)                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ S3 Sync      │  │ Cache Headers│  │ Invalidate   │                   │
│  │              │  │              │  │ CloudFront   │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  STAGE 3: VERIFY & NOTIFY                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                   │
│  │ Lighthouse   │  │ Email        │  │ Slack        │                   │
│  │ (optional)   │  │ Notification │  │ (optional)   │                   │
│  └──────────────┘  └──────────────┘  └──────────────┘                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Stage 1: Validation

#### HTML Validation with proof-html

**Recommended Action:** [anishathalye/proof-html@v2](https://github.com/anishathalye/proof-html)
**Version:** v2.2.3 (January 2026)
**Confidence:** HIGH (verified directly from repository)

**What it checks:**
- HTML syntax validity (Nu HTML Validator)
- CSS validity
- Internal link integrity
- External link reachability
- Image references exist
- Alt text presence
- Favicon validity
- OpenGraph metadata

```yaml
validate-html:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Validate HTML and check links
      uses: anishathalye/proof-html@v2
      with:
        directory: ./
        check_html: true
        check_css: true
        check_external_hash: false  # Skip anchor verification on external sites
        enforce_https: true
        ignore_url: |
          https://booking.appointy.com/
          https://www.google.com/recaptcha/
        ignore_url_re: |
          ^https://fonts\.googleapis\.com/
          ^https://use\.typekit\.net/
```

**Why proof-html over alternatives:**
- Combines HTML validation + link checking in one action
- Well-maintained (updated January 2026)
- Configurable ignore patterns for external services
- Fast enough for CI (< 60 seconds for typical portfolio site)

#### Link Checking with lychee (Alternative/Supplement)

**Recommended Action:** [lycheeverse/lychee-action@v2](https://github.com/lycheeverse/lychee-action)
**Version:** v2.7.0 (October 2025)
**Confidence:** HIGH (verified directly from repository)

Use lychee if you need faster link checking or more detailed output.

```yaml
check-links:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check links
      uses: lycheeverse/lychee-action@v2
      with:
        args: --verbose --no-progress './**/*.html'
        fail: true
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

**When to use lychee instead of proof-html:**
- Need caching for rate-limited external links
- Want Markdown output for GitHub issues
- Checking markdown files in addition to HTML

#### Image Validation (Custom Step)

No single GitHub Action handles image validation well. Use a custom script.

```yaml
validate-images:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v6

    - name: Check for missing images referenced in HTML
      run: |
        # Extract all image src attributes from HTML
        grep -oP 'src="images/[^"]+' index.html | sed 's/src="//' | sort -u > /tmp/referenced.txt

        # List actual images
        ls images/*.{jpg,jpeg,png,gif,webp} 2>/dev/null | sed 's|images/||' | sort -u > /tmp/actual.txt

        # Find referenced but missing
        comm -23 <(cat /tmp/referenced.txt | sed 's|images/||' | sort) /tmp/actual.txt > /tmp/missing.txt

        if [ -s /tmp/missing.txt ]; then
          echo "ERROR: Missing images referenced in HTML:"
          cat /tmp/missing.txt
          exit 1
        fi

        echo "All referenced images exist"

    - name: Check for oversized images
      run: |
        # Flag images over 2MB (too large for web)
        find images -type f \( -name "*.jpg" -o -name "*.png" \) -size +2M | while read f; do
          echo "WARNING: Large image: $f ($(du -h "$f" | cut -f1))"
        done
```

### Stage 2: Deploy (Existing Pattern - Enhance)

The current deploy workflow is solid. Recommended enhancements:

#### Selective Cache Invalidation

**Current pattern:** Wildcard invalidation (`/*`)
**Improved pattern:** Selective invalidation for cost and speed

```yaml
- name: Invalidate CloudFront cache (selective)
  run: |
    # Get changed files from git
    CHANGED=$(git diff --name-only HEAD~1 HEAD | grep -E '\.(html|css|js)$' || echo "")

    if [ -n "$CHANGED" ]; then
      # Convert to CloudFront paths
      PATHS=$(echo "$CHANGED" | sed 's|^|/|' | tr '\n' ' ')
      aws cloudfront create-invalidation \
        --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
        --paths $PATHS
    fi

    # Always invalidate HTML (short cache anyway)
    aws cloudfront create-invalidation \
      --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
      --paths "/index.html"
```

**Why selective invalidation:**
- First 1,000 paths/month are free
- Wildcard counts as one path but invalidates everything
- For frequent deploys, selective is more cache-efficient
- Images with immutable cache headers don't need invalidation

**When to use wildcard anyway:**
- Major site redesign
- More than 10-15 files changed
- Debugging cache issues

### Stage 3: Verify and Notify

#### Lighthouse Performance Testing

**Recommended Action:** [treosh/lighthouse-ci-action@v12](https://github.com/treosh/lighthouse-ci-action)
**Version:** v12
**Confidence:** HIGH (verified directly from repository)

```yaml
lighthouse:
  runs-on: ubuntu-latest
  needs: deploy  # Run after deploy
  steps:
    - uses: actions/checkout@v6

    - name: Run Lighthouse
      uses: treosh/lighthouse-ci-action@v12
      with:
        urls: |
          https://cassiecayphotography.com/
        uploadArtifacts: true
        temporaryPublicStorage: true  # Get shareable report URL
        budgetPath: ./lighthouse-budget.json
```

**Budget file example** (`lighthouse-budget.json`):
```json
[
  {
    "path": "/*",
    "resourceSizes": [
      { "resourceType": "total", "budget": 5000 },
      { "resourceType": "image", "budget": 3000 }
    ],
    "resourceCounts": [
      { "resourceType": "third-party", "budget": 10 }
    ]
  }
]
```

**Recommendation for this project:** Make Lighthouse informational, not blocking.

```yaml
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v12
  continue-on-error: true  # Don't fail deploy for perf regressions
  with:
    urls: https://cassiecayphotography.com/
    uploadArtifacts: true
```

#### Email Notifications

**Recommended Action:** [dawidd6/action-send-mail@v7](https://github.com/dawidd6/action-send-mail)
**Version:** v7 (December 2025)
**Confidence:** HIGH (verified directly from repository)

```yaml
notify:
  runs-on: ubuntu-latest
  needs: [validate, deploy]
  if: always()  # Run even if previous steps fail
  steps:
    - name: Send success email
      if: needs.deploy.result == 'success'
      uses: dawidd6/action-send-mail@v7
      with:
        server_address: smtp.gmail.com
        server_port: 587
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: "Website Updated Successfully"
        to: cassiecayphoto@gmail.com
        from: GitHub Actions <noreply@github.com>
        body: |
          Your website has been updated!

          Changes are now live at https://cassiecayphotography.com

          Commit: ${{ github.sha }}
          By: ${{ github.actor }}

    - name: Send failure email
      if: needs.validate.result == 'failure' || needs.deploy.result == 'failure'
      uses: dawidd6/action-send-mail@v7
      with:
        server_address: smtp.gmail.com
        server_port: 587
        username: ${{ secrets.EMAIL_USERNAME }}
        password: ${{ secrets.EMAIL_PASSWORD }}
        subject: "Website Update FAILED - Action Required"
        to: cassiecayphoto@gmail.com
        from: GitHub Actions <noreply@github.com>
        priority: high
        body: |
          Your website update encountered an error.

          Please check the following:
          - Are all images in the images/ folder?
          - Are there any typos in image filenames?

          Technical details: ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}
```

**Email Setup Requirements:**
1. Create Gmail App Password (not regular password)
2. Store in GitHub Secrets: `EMAIL_USERNAME`, `EMAIL_PASSWORD`
3. Consider using AWS SES for production (already have AWS)

#### Slack Notifications (Alternative)

**Recommended Action:** [ravsamhq/notify-slack-action@v2](https://github.com/ravsamhq/notify-slack-action)
**Version:** v2.5.0
**Confidence:** HIGH (verified directly from repository)

```yaml
notify-slack:
  runs-on: ubuntu-latest
  needs: [validate, deploy]
  if: always()
  steps:
    - uses: ravsamhq/notify-slack-action@v2
      with:
        status: ${{ job.status }}
        notification_title: "Website Deployment"
        message_format: "{emoji} *{status_message}* for cassiecayphotography.com"
        notify_when: "success,failure"
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

**Setup complexity:** Medium
- Create Slack App with Incoming Webhooks
- Add webhook URL to GitHub Secrets
- Non-technical users comfortable with Slack will appreciate this

**Recommendation:** Start with email (simpler), add Slack later if desired.

## Pre-Commit Hooks

### Using Husky (Recommended for Node.js projects)

**Tool:** [Husky v9](https://typicode.github.io/husky/)
**Confidence:** HIGH (official documentation)

```bash
# Install
npm install husky --save-dev
npx husky init

# Create pre-commit hook
echo '#!/bin/sh
# Check for referenced images that do not exist
grep -oP "src=\"images/[^\"]+\"" index.html | while read -r line; do
  FILE=$(echo "$line" | sed "s/src=\"//" | sed "s/\"//")
  if [ ! -f "$FILE" ]; then
    echo "ERROR: Missing image: $FILE"
    exit 1
  fi
done
' > .husky/pre-commit
```

### Using pre-commit Framework (Alternative)

**Tool:** [pre-commit](https://pre-commit.com/)
**Confidence:** HIGH (official documentation)

`.pre-commit-config.yaml`:
```yaml
repos:
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: v4.0.0-alpha.8
    hooks:
      - id: prettier
        types_or: [html, css]

  - repo: local
    hooks:
      - id: check-images
        name: Check image references
        entry: bash -c 'grep -oP "src=\"images/[^\"]+\"" index.html | while read -r line; do FILE=$(echo "$line" | sed "s/src=\"//" | sed "s/\"//"); if [ ! -f "$FILE" ]; then echo "Missing: $FILE"; exit 1; fi; done'
        language: system
        files: \.html$
```

**Recommendation for this project:** Use Husky since the infrastructure directory already has Node.js (package.json exists for CDK).

### Pre-commit Hook: Quick Image Validation

For a non-technical user, the most valuable pre-commit check is: "Do all referenced images exist?"

```bash
#!/bin/sh
# .husky/pre-commit

# Extract image references and check each exists
MISSING=""
for img in $(grep -oP 'src="images/[^"]+' index.html | sed 's/src="//' | sort -u); do
  if [ ! -f "$img" ]; then
    MISSING="$MISSING\n  - $img"
  fi
done

if [ -n "$MISSING" ]; then
  echo "ERROR: These images are referenced but missing:"
  echo -e "$MISSING"
  echo ""
  echo "Add the missing images or fix the references in index.html"
  exit 1
fi

echo "All images OK"
```

## Cache Invalidation Strategy

### Current Approach Analysis

The existing workflow uses:
```yaml
--cache-control "public, max-age=31536000, immutable"  # All files
--cache-control "public, max-age=300"  # HTML override
```

This is correct for:
- Images: Long cache (1 year) - images rarely change, and filenames are unique
- HTML: Short cache (5 minutes) - content changes frequently

### Recommended Improvements

#### 1. Content-Based Filenames for CSS/JS

If you ever add versioned CSS/JS, use content hashes:
```
style-abc123.css  # Name changes when content changes
```
Then cache forever and never invalidate.

#### 2. Invalidation Decision Tree

```
Did HTML change?
├── Yes → Invalidate /index.html
└── No → Skip HTML invalidation

Did images change?
├── New images added → No invalidation needed (new paths)
├── Images replaced (same name) → Invalidate specific paths
└── Images deleted → Update HTML references
```

#### 3. Cost-Aware Invalidation

```yaml
- name: Smart CloudFront invalidation
  run: |
    CHANGED_COUNT=$(git diff --name-only HEAD~1 HEAD | wc -l)

    if [ "$CHANGED_COUNT" -gt 20 ]; then
      # Many files: use wildcard (counts as 1 path)
      aws cloudfront create-invalidation \
        --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
        --paths "/*"
    else
      # Few files: invalidate specifically
      PATHS=$(git diff --name-only HEAD~1 HEAD | sed 's|^|/|' | tr '\n' ' ')
      aws cloudfront create-invalidation \
        --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
        --paths $PATHS "/index.html"
    fi
```

## Complete Workflow Example

```yaml
name: Deploy with Validation

on:
  push:
    branches: [main]
    paths-ignore:
      - 'infrastructure/**'
      - '.github/dependabot.yml'
      - 'README.md'
  workflow_dispatch:

permissions:
  id-token: write
  contents: read

env:
  AWS_REGION: us-east-1
  S3_BUCKET: cassiecayphotography.com-site-content

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: Validate HTML and check links
        uses: anishathalye/proof-html@v2
        with:
          directory: ./
          check_external_hash: false
          ignore_url: |
            https://booking.appointy.com/
            https://www.google.com/recaptcha/
          ignore_url_re: |
            ^https://fonts\.googleapis\.com/
            ^https://use\.typekit\.net/

      - name: Check image references
        run: |
          MISSING=""
          for img in $(grep -oP 'src="images/[^"]+' index.html | sed 's/src="//' | sort -u); do
            if [ ! -f "$img" ]; then
              MISSING="$MISSING $img"
            fi
          done
          if [ -n "$MISSING" ]; then
            echo "ERROR: Missing images:$MISSING"
            exit 1
          fi

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6

      - uses: aws-actions/configure-aws-credentials@v5
        with:
          role-to-assume: arn:aws:iam::241654197557:role/CassiePhotoGitHubActionsDeploymentRole
          aws-region: ${{ env.AWS_REGION }}

      - name: Get CloudFront Distribution ID
        id: cloudfront
        run: |
          DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
            --stack-name CassiePhotoStaticSiteStack \
            --query "Stacks[0].Outputs[?ExportName=='CassiePhotoDistributionId'].OutputValue" \
            --output text)
          echo "distribution_id=$DISTRIBUTION_ID" >> $GITHUB_OUTPUT

      - name: Sync to S3
        run: |
          aws s3 sync . s3://${{ env.S3_BUCKET }} \
            --delete \
            --exclude ".git/*" \
            --exclude ".github/*" \
            --exclude "infrastructure/*" \
            --exclude ".DS_Store" \
            --exclude "*.md" \
            --exclude ".husky/*" \
            --exclude "package*.json" \
            --cache-control "public, max-age=31536000, immutable"

      - name: Set HTML cache headers
        run: |
          aws s3 cp s3://${{ env.S3_BUCKET }}/index.html s3://${{ env.S3_BUCKET }}/index.html \
            --cache-control "public, max-age=300" \
            --content-type "text/html" \
            --metadata-directive REPLACE

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ steps.cloudfront.outputs.distribution_id }} \
            --paths "/*"

  lighthouse:
    needs: deploy
    runs-on: ubuntu-latest
    continue-on-error: true
    steps:
      - uses: actions/checkout@v6

      - name: Wait for CloudFront propagation
        run: sleep 30

      - uses: treosh/lighthouse-ci-action@v12
        with:
          urls: https://cassiecayphotography.com/
          uploadArtifacts: true
          temporaryPublicStorage: true

  notify:
    needs: [validate, deploy]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Send success notification
        if: needs.deploy.result == 'success'
        uses: dawidd6/action-send-mail@v7
        with:
          server_address: smtp.gmail.com
          server_port: 587
          secure: true
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: "Cassie Cay Photography - Website Updated"
          to: cassiecayphoto@gmail.com
          from: Website Updates <noreply@cassiecayphotography.com>
          body: |
            Your website has been updated successfully!

            The changes are now live at https://cassiecayphotography.com

            ---
            This is an automated message from your website deployment system.

      - name: Send failure notification
        if: needs.validate.result == 'failure' || needs.deploy.result == 'failure'
        uses: dawidd6/action-send-mail@v7
        with:
          server_address: smtp.gmail.com
          server_port: 587
          secure: true
          username: ${{ secrets.EMAIL_USERNAME }}
          password: ${{ secrets.EMAIL_PASSWORD }}
          subject: "ATTENTION: Website Update Failed"
          to: cassiecayphoto@gmail.com
          from: Website Updates <noreply@cassiecayphotography.com>
          priority: high
          body: |
            Your website update could not be completed.

            COMMON ISSUES:
            - An image file may be missing
            - There may be a broken link in the website

            WHAT TO DO:
            Please contact your website administrator or check:
            ${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}

            ---
            This is an automated message from your website deployment system.
```

## Tool Summary

| Tool | Purpose | Version | Confidence | Setup Complexity |
|------|---------|---------|------------|------------------|
| [proof-html](https://github.com/anishathalye/proof-html) | HTML validation + link checking | v2.2.3 | HIGH | Low |
| [lychee-action](https://github.com/lycheeverse/lychee-action) | Fast link checking | v2.7.0 | HIGH | Low |
| [lighthouse-ci-action](https://github.com/treosh/lighthouse-ci-action) | Performance testing | v12 | HIGH | Low |
| [action-send-mail](https://github.com/dawidd6/action-send-mail) | Email notifications | v7 | HIGH | Medium |
| [notify-slack-action](https://github.com/ravsamhq/notify-slack-action) | Slack notifications | v2.5.0 | HIGH | Medium |
| [Husky](https://typicode.github.io/husky/) | Git hooks | v9 | HIGH | Low |

## Roadmap Implications

### Phase 1: Core Validation (Recommended First)
- Add HTML validation (proof-html)
- Add image reference checking
- Keep existing deploy flow

### Phase 2: Notifications
- Add email notifications (requires Gmail App Password or AWS SES)
- Clear success/failure messages for non-technical owner

### Phase 3: Pre-commit Hooks
- Install Husky
- Add image validation hook
- Catches errors before they reach CI

### Phase 4: Performance (Optional)
- Add Lighthouse CI
- Make informational, not blocking
- Review quarterly for optimization opportunities

## Sources

- [proof-html GitHub Repository](https://github.com/anishathalye/proof-html) - v2.2.3, January 2026
- [lychee-action GitHub Repository](https://github.com/lycheeverse/lychee-action) - v2.7.0, October 2025
- [lighthouse-ci-action GitHub Repository](https://github.com/treosh/lighthouse-ci-action) - v12
- [action-send-mail GitHub Repository](https://github.com/dawidd6/action-send-mail) - v7, December 2025
- [notify-slack-action GitHub Repository](https://github.com/ravsamhq/notify-slack-action) - v2.5.0
- [Husky Official Documentation](https://typicode.github.io/husky/)
- [AWS CloudFront Invalidation Documentation](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html)
- [GitHub Actions Workflow Documentation](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/notifications-for-workflow-runs)
