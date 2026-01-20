---
phase: 01-quick-fixes
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - infrastructure/bin/infrastructure.ts
  - infrastructure/package.json
  - infrastructure/lib/github-oidc-stack.ts
autonomous: false

must_haves:
  truths:
    - "Site loads correctly at https://cassiecayphotography.com"
    - "CDK-managed CloudFront has domain aliases configured"
    - "Old CloudFront distribution is deleted"
    - "CDK dependencies are current with no critical vulnerabilities"
  artifacts:
    - path: "infrastructure/bin/infrastructure.ts"
      provides: "skipDomainSetup set to false"
      contains: "skipDomainSetup: false"
    - path: "infrastructure/package.json"
      provides: "Updated CDK dependencies"
      contains: '"aws-cdk-lib":'
  key_links:
    - from: "infrastructure/lib/static-site-stack.ts"
      to: "Route 53 hosted zone"
      via: "CDK deployment"
      pattern: "route53.HostedZone.fromLookup"
---

<objective>
Complete the CDK domain migration by updating dependencies, enabling domain setup, and removing old CloudFront.

Purpose: Fully migrate to CDK-managed infrastructure with domain properly attached
Output: Updated CDK code deployed, old CloudFront deleted, site serving from new infrastructure
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/roadmap/ROADMAP.md
@.planning/codebase/CONCERNS.md
@infrastructure/bin/infrastructure.ts
@infrastructure/lib/static-site-stack.ts
</context>

<tasks>

<task type="auto">
  <name>Task 1: Update CDK and npm dependencies</name>
  <files>infrastructure/package.json</files>
  <action>
  Update all dependencies in infrastructure/package.json to latest versions:

  ```bash
  cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/infrastructure
  npm update
  npm audit fix
  ```

  After update, run `npm audit` to verify no critical or high vulnerabilities remain.
  Run `npx cdk synth` to verify CDK still synthesizes correctly with new versions.
  </action>
  <verify>
  1. `cd infrastructure && npm audit` shows no critical/high vulnerabilities
  2. `cd infrastructure && npx cdk synth` completes without errors
  3. `cd infrastructure && npm outdated` shows no critical outdated packages
  </verify>
  <done>CDK and npm dependencies updated, no critical vulnerabilities, synth works</done>
</task>

<task type="auto">
  <name>Task 2: Delete old CloudFront distribution</name>
  <files>None (AWS console/CLI operation)</files>
  <action>
  The old manually-created CloudFront distribution (ED1MCQW8EZ1X1) must be deleted before the new CDK-managed one can take over the domain aliases.

  Step 0: Pre-check distribution state before proceeding:
  ```bash
  export AWS_PROFILE=personal
  DIST_STATUS=$(aws cloudfront get-distribution --id ED1MCQW8EZ1X1 2>&1)
  if echo "$DIST_STATUS" | grep -q "NoSuchDistribution"; then
    echo "Distribution already deleted - skip to Task 3"
    exit 0
  fi
  ENABLED=$(echo "$DIST_STATUS" | jq -r '.Distribution.DistributionConfig.Enabled')
  STATUS=$(echo "$DIST_STATUS" | jq -r '.Distribution.Status')
  echo "Current state: Enabled=$ENABLED, Status=$STATUS"
  ```

  If already deleted, skip to Task 3. If already disabled and Deployed, skip to Step 4.

  Step 1: Get current distribution config:
  ```bash
  export AWS_PROFILE=personal
  aws cloudfront get-distribution-config --id ED1MCQW8EZ1X1 > /tmp/cf-config.json
  ```

  Step 2: Extract the ETag and update config to disable:
  ```bash
  ETAG=$(cat /tmp/cf-config.json | jq -r '.ETag')
  cat /tmp/cf-config.json | jq '.DistributionConfig.Enabled = false' | jq '.DistributionConfig' > /tmp/cf-disable.json
  aws cloudfront update-distribution --id ED1MCQW8EZ1X1 --distribution-config file:///tmp/cf-disable.json --if-match $ETAG
  ```

  Step 3: Wait for distribution to fully disable (Status: Deployed):
  ```bash
  aws cloudfront wait distribution-deployed --id ED1MCQW8EZ1X1
  ```

  Step 4: Delete the disabled distribution:
  ```bash
  ETAG=$(aws cloudfront get-distribution-config --id ED1MCQW8EZ1X1 | jq -r '.ETag')
  aws cloudfront delete-distribution --id ED1MCQW8EZ1X1 --if-match $ETAG
  ```

  Note: This may take 10-15 minutes for the disable to propagate before deletion is allowed.
  </action>
  <verify>
  1. `aws cloudfront get-distribution --id ED1MCQW8EZ1X1 2>&1` returns NoSuchDistribution error
  2. Or: `aws cloudfront list-distributions` does not include ED1MCQW8EZ1X1
  </verify>
  <done>Old CloudFront distribution ED1MCQW8EZ1X1 is deleted</done>
</task>

<task type="auto">
  <name>Task 3: Enable domain setup and deploy</name>
  <files>infrastructure/bin/infrastructure.ts</files>
  <action>
  In infrastructure/bin/infrastructure.ts, change line 30:
  From: `skipDomainSetup: true,`
  To: `skipDomainSetup: false,`

  Also remove or update the TODO comment on lines 24-25.

  Then deploy:
  ```bash
  export AWS_PROFILE=personal
  cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/infrastructure
  npx cdk deploy CassiePhotoStaticSiteStack --require-approval never
  ```

  This will:
  - Create ACM certificate for cassiecayphotography.com + www.cassiecayphotography.com
  - Add domain aliases to CloudFront distribution
  - Create Route 53 A and AAAA records pointing to CloudFront
  </action>
  <verify>
  1. `grep "skipDomainSetup: false" infrastructure/bin/infrastructure.ts` returns match
  2. `curl -I https://cassiecayphotography.com` returns 200 with CloudFront headers
  3. `dig cassiecayphotography.com` shows CloudFront CNAME/alias
  4. CDK deploy completed successfully
  </verify>
  <done>Domain attached to CDK-managed CloudFront, site accessible at https://cassiecayphotography.com</done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <what-built>Domain migration from old CloudFront to CDK-managed CloudFront</what-built>
  <how-to-verify>
  1. Open https://cassiecayphotography.com in browser
  2. Verify site loads correctly with images and styling
  3. Verify HTTPS certificate shows as valid (green padlock)
  4. Click through portfolio images to verify they display
  5. Navigate to contact form section to verify it's visible
  </how-to-verify>
  <resume-signal>Type "approved" if site works correctly, or describe any issues</resume-signal>
</task>

</tasks>

<verification>
1. Old CloudFront deleted: `aws cloudfront get-distribution --id ED1MCQW8EZ1X1` returns error
2. New CloudFront has domain: CDK deploy output shows domain aliases
3. Site accessible: `curl -I https://cassiecayphotography.com` returns 200
4. Dependencies current: `npm audit` in infrastructure/ shows no critical issues
</verification>

<success_criteria>
- INFRA-02: CDK and npm dependencies updated to latest
- INFRA-01: Domain migration complete - site serves from CDK-managed CloudFront
- Old CloudFront (ED1MCQW8EZ1X1) deleted
- Site accessible at https://cassiecayphotography.com with valid HTTPS
</success_criteria>

<output>
After completion, create `.planning/phases/01-quick-fixes/01-02-SUMMARY.md`
</output>
