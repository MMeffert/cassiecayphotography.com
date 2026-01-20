---
phase: 04-ci-validation
plan: 01
subsystem: ci
tags: [html-validate, node-html-parser, github-actions, ci-cd, validation]

# Dependency graph
requires:
  - phase: 02-build-foundation
    provides: Vite build system and npm scripts
  - phase: 03-image-optimization
    provides: Optimized images and HTML with picture elements
provides:
  - HTML structural validation script
  - Image and link reference checking
  - CI validation job blocking deploy on errors
  - Deploy from Vite dist/ output
affects: [05-code-quality, 06-deploy-optimization]

# Tech tracking
tech-stack:
  added: [html-validate, node-html-parser]
  patterns: [CI validation gates, pre-deploy validation]

key-files:
  created:
    - scripts/validate-html.js
    - scripts/check-references.js
    - images/favicon.ico
  modified:
    - package.json
    - .github/workflows/deploy.yml

key-decisions:
  - "HTML validation focuses on critical errors only - trailing whitespace and accessibility deferred"
  - "Reference checker validates img src, srcset, a href, data-image-src, data-thumb attributes"
  - "Deploy job syncs from dist/ not root - proper Vite build deployment"

# Metrics
duration: 3min
completed: 2026-01-20
---

# Phase 4 Plan 1: CI Validation Summary

**HTML validation and reference checking scripts integrated into GitHub Actions workflow, blocking deploy on validation errors**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-20T18:38:03Z
- **Completed:** 2026-01-20T18:41:03Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Created HTML validation script using html-validate with legacy-site-appropriate rules
- Created reference checker that validates all image and link references exist
- Added validate job to GitHub Actions that runs validation and build before deploy
- Updated deploy job to sync from dist/ (Vite build output) instead of root directory

## Task Commits

Each task was committed atomically:

1. **Task 1: Install html-validate and create validation script** - `01610a8` (feat)
2. **Task 2: Create reference checker for images and links** - `76ff1ec` (feat)
3. **Task 3: Add validation job to GitHub Actions workflow** - `293f613` (feat)

## Files Created/Modified

- `scripts/validate-html.js` - HTML structural validation using html-validate
- `scripts/check-references.js` - Validates all image/link references exist
- `images/favicon.ico` - Placeholder favicon (was missing)
- `package.json` - Added validate:html and validate:refs scripts
- `.github/workflows/deploy.yml` - Added validate job, updated deploy to use dist/

## Decisions Made

1. **HTML validation rules are conservative** - Disabled rules for trailing whitespace, accessibility (WCAG), deprecated elements, and attribute case. These are acceptable in this legacy site and would generate hundreds of warnings that aren't actionable without major refactoring.

2. **Reference checker covers multiple patterns** - Checks img src/srcset, source srcset, a href, data-image-src, data-thumb, and favicon links. Skips external URLs, anchors, mailto, and data URIs.

3. **Deploy from dist/** - Updated S3 sync to use Vite's build output directory rather than syncing the entire project root. This ensures only processed/optimized assets are deployed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added missing favicon.ico**

- **Found during:** Task 2 (Reference checker testing)
- **Issue:** index.html references `images/favicon.ico` but file did not exist
- **Fix:** Created placeholder favicon.ico file in images/ directory
- **Files modified:** images/favicon.ico
- **Verification:** Reference checker passes, favicon link now resolves
- **Committed in:** 76ff1ec (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix was necessary for CI to pass. No scope creep.

## Issues Encountered

None - plan executed smoothly after adjusting validation rules for legacy site compatibility.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Validation scripts are ready and working
- CI pipeline will fail on broken HTML structure or missing references
- Ready for 04-02-PLAN.md if additional CI validation is planned
- Ready for Phase 5 (code quality) if phase 4 is complete

---
*Phase: 04-ci-validation*
*Completed: 2026-01-20*
