---
phase: 01-quick-fixes
plan: 03
type: execute
wave: 2
depends_on:
  - "01-02"
files_modified:
  - infrastructure/lib/github-oidc-stack.ts
autonomous: true

must_haves:
  truths:
    - "GitHub Actions deployment succeeds using only the new S3 bucket"
    - "Dependabot alerts user to new security vulnerabilities in dependencies"
    - "IAM policy no longer grants access to legacy bucket"
  artifacts:
    - path: "infrastructure/lib/github-oidc-stack.ts"
      provides: "IAM policy with only new bucket"
      contains: "cassiecayphotography.com-site-content"
  key_links:
    - from: "infrastructure/lib/github-oidc-stack.ts"
      to: "S3 bucket"
      via: "IAM policy resource"
      pattern: "cassiecayphotography.com-site-content"
---

<objective>
Remove legacy S3 bucket permissions and verify Dependabot security alerts are configured.

Purpose: Achieve least-privilege IAM and ensure dependency vulnerabilities are surfaced
Output: Updated IAM policy deployed, Dependabot alerts verified active
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/roadmap/ROADMAP.md
@infrastructure/lib/github-oidc-stack.ts
@.github/dependabot.yml
</context>

<tasks>

<task type="auto">
  <name>Task 1: Remove legacy S3 bucket permission</name>
  <files>infrastructure/lib/github-oidc-stack.ts</files>
  <action>
  In infrastructure/lib/github-oidc-stack.ts, modify the S3DeploymentPermissions policy statement.

  Remove lines 65-67 which grant access to the old bucket:
  ```typescript
  // Existing bucket (for migration period)
  `arn:aws:s3:::cassiecayphotography.com`,
  `arn:aws:s3:::cassiecayphotography.com/*`,
  ```

  Also update the comment on line 61 from:
  `// New CDK-managed bucket`
  to just:
  `// Site content bucket`

  The final resources array should only contain:
  ```typescript
  resources: [
    // Site content bucket
    `arn:aws:s3:::cassiecayphotography.com-site-content`,
    `arn:aws:s3:::cassiecayphotography.com-site-content/*`,
  ],
  ```

  Then deploy the change:
  ```bash
  export AWS_PROFILE=personal
  cd /Users/mitchellmeffert/Git/Personal/cassiecayphotography.com/infrastructure
  npx cdk deploy CassiePhotoGitHubOidcStack --require-approval never
  ```
  </action>
  <verify>
  1. `grep "cassiecayphotography.com\`" infrastructure/lib/github-oidc-stack.ts` returns no matches (note: escaping the backtick)
  2. `grep "cassiecayphotography.com-site-content" infrastructure/lib/github-oidc-stack.ts` returns matches
  3. CDK deploy completed successfully
  4. `aws iam get-role-policy --role-name CassiePhotoGitHubActionsDeploymentRole --policy-name <policy-name>` shows only new bucket
  </verify>
  <done>Legacy S3 bucket removed from IAM policy, only new bucket in permissions</done>
</task>

<task type="auto">
  <name>Task 2: Verify Dependabot security alerts enabled</name>
  <files>None (GitHub settings verification)</files>
  <action>
  The dependabot.yml config file already exists at .github/dependabot.yml with correct configuration.

  Verify that Dependabot security alerts are enabled in GitHub repository settings:

  ```bash
  # Check if security alerts are enabled via GitHub API
  gh api repos/MMeffert/cassiecayphotography.com/vulnerability-alerts -i 2>&1 | head -1
  ```

  If the response is `HTTP/2 204`, security alerts are enabled.
  If the response is `HTTP/2 404`, enable them:

  ```bash
  gh api repos/MMeffert/cassiecayphotography.com/vulnerability-alerts -X PUT
  ```

  Also verify Dependabot is configured correctly:
  ```bash
  gh api repos/MMeffert/cassiecayphotography.com/dependabot
  ```
  </action>
  <verify>
  1. `gh api repos/MMeffert/cassiecayphotography.com/vulnerability-alerts -i 2>&1 | head -1` returns `HTTP/2 204`
  2. `.github/dependabot.yml` exists with npm and github-actions ecosystems
  3. No pending Dependabot security alerts (or if any, they are acknowledged)
  </verify>
  <done>Dependabot security alerts enabled and configured for the repository</done>
</task>

</tasks>

<verification>
1. IAM policy clean: Legacy bucket references removed from github-oidc-stack.ts
2. Deployment works: Push to main triggers successful GitHub Actions deploy
3. Security enabled: Dependabot vulnerability alerts are active
</verification>

<success_criteria>
- INFRA-03: Legacy S3 bucket permission removed, deployed to AWS
- INFRA-04: Dependabot security alerts verified enabled
- GitHub Actions deployment still works after IAM change
</success_criteria>

<output>
After completion, create `.planning/phases/01-quick-fixes/01-03-SUMMARY.md`
</output>
