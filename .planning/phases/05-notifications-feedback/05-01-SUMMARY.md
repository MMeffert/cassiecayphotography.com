---
phase: 05-notifications-feedback
plan: 01
subsystem: infra
tags: [ses, github-actions, notifications, email, lighthouse]

# Dependency graph
requires:
  - phase: 01-quick-fixes
    provides: GitHub OIDC role and SES infrastructure
provides:
  - Deploy success notifications with Lighthouse scores
  - Deploy failure notifications with error context
  - Job outputs for Lighthouse score extraction
affects: [monitoring, observability]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - SES email notifications from GitHub Actions
    - Job outputs for inter-job data passing

key-files:
  created: []
  modified:
    - infrastructure/lib/github-oidc-stack.ts
    - .github/workflows/deploy.yml

key-decisions:
  - "Use env vars in workflow to avoid YAML multiline parsing issues"
  - "Rename best-practices output to best_practices (hyphens cause issues)"
  - "Send to Mitchell, not Cassie (per user requirement)"

patterns-established:
  - "SES notifications: Use env block for complex variables, build BODY in shell"

# Metrics
duration: 8min
completed: 2026-01-20
---

# Phase 5 Plan 01: Deploy Notifications Summary

**SES email notifications on deploy success/failure with Lighthouse scores and workflow links**

## Performance

- **Duration:** 8 min
- **Started:** 2026-01-20T19:45:00Z
- **Completed:** 2026-01-20T19:53:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- GitHub OIDC role now has SES send permissions (restricted to no-reply@cassiecayphotography.com)
- Deploy workflow extracts Lighthouse scores as job outputs
- Success notification includes site link, commit info, and all 4 Lighthouse scores
- Failure notification includes failed job name and workflow link
- First successful notification sent with scores: Perf=41, A11y=84, BP=96, SEO=100

## Task Commits

Each task was committed atomically:

1. **Task 1: Add SES permissions to GitHub OIDC role** - `8e20d48` (feat)
2. **Task 2: Add notification steps to deploy workflow** - `dd703d6` (feat)

## Files Created/Modified

- `infrastructure/lib/github-oidc-stack.ts` - Added ses:SendEmail permission with FromAddress condition
- `.github/workflows/deploy.yml` - Added Lighthouse score extraction, success notification, and notify-failure job

## Decisions Made

1. **Use env vars for complex workflow variables** - Multiline strings in YAML run blocks can cause parsing issues; using the `env:` block keeps variables clean
2. **Rename output from best-practices to best_practices** - GitHub Actions has issues with hyphens in output names when referenced in expressions
3. **Recipient is Mitchell, not Cassie** - Per user requirement, notifications go to mitchell@mitchellmeffert.com

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed YAML parsing of multiline SES message**
- **Found during:** Task 2 (initial workflow push failed)
- **Issue:** Inline multiline strings in aws ses send-email command caused workflow file parsing failure
- **Fix:** Refactored to use env block for GitHub context variables, build BODY in shell, pass clean variable
- **Files modified:** .github/workflows/deploy.yml
- **Verification:** Workflow run 21185060333 completed successfully
- **Committed in:** dd703d6 (amended)

**2. [Rule 1 - Bug] Fixed hyphenated output name**
- **Found during:** Task 2 (investigating workflow failure)
- **Issue:** Output name `best-practices` may cause issues in GitHub expression syntax
- **Fix:** Changed to `best_practices` (underscore) throughout workflow
- **Files modified:** .github/workflows/deploy.yml
- **Verification:** Scores correctly passed to deploy job
- **Committed in:** dd703d6 (amended)

---

**Total deviations:** 2 auto-fixed (2 bugs)
**Impact on plan:** Both fixes required for correct YAML parsing. No scope creep.

## Issues Encountered

None beyond the auto-fixed YAML issues above.

## User Setup Required

None - SES was already configured with verified sender in Phase 1 (contact form).

## Next Phase Readiness

- Notifications working for both success and failure cases
- Lighthouse scores available as job outputs for potential future use
- Ready for Phase 5 Plan 02 (if any) or Phase 6

---
*Phase: 05-notifications-feedback*
*Completed: 2026-01-20*
