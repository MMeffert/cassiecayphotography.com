# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-20)

**Core value:** The site must remain fast, secure, and easy for Cassie to update.
**Current focus:** v2.0 — jQuery Removal & Bootstrap 5 Migration

## Current Position

Phase: 11 - Portfolio Grid Replacement
Plan: 01 of 3 complete
Status: In progress
Last activity: 2026-01-21 — Completed 11-01-PLAN.md (Muuri library and CSS)

Progress: [████░░░░░░░░░░░░░░░░] 2/6 phases

## Performance Metrics

**Velocity:**
- Total plans completed: 21
- Average duration: 5 min
- Total execution time: 103 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-quick-fixes | 3 | 20 min | 7 min |
| 02-build-foundation | 2 | 9 min | 4.5 min |
| 03-image-optimization | 4 | 16 min | 4 min |
| 04-ci-validation | 2 | 6 min | 3 min |
| 05-notifications-feedback | 1 | 8 min | 8 min |
| 06-pre-commit-hooks | 1 | 4 min | 4 min |
| 07-javascript-cleanup | 1 | 8 min | 8 min |
| 08-library-modernization | 3 | 22 min | 7 min |
| 10-bootstrap-5-migration | 1 | 8 min | 8 min |
| 11-portfolio-grid-replacement | 1 | 2 min | 2 min |

**Recent Trend:**
- Last 5 plans: 08-02 (3 min), 08-03 (15 min), 10-01 (8 min), 11-01 (2 min)
- Trend: Phase 11 started - Muuri library and CSS foundation complete

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Phase | Decision | Rationale |
|-------|----------|-----------|
| 01-01 | Renamed file + updated HTML for broken link | Both file and reference needed correction |
| 01-01 | Removed first duplicate message element | Second element is active (has styling, used by JS) |
| 01-02 | Deleted old CloudFront before CDK domain setup | Free domain aliases for CDK-managed distribution |
| 01-02 | Used CDK-managed ACM with DNS validation | Automatic certificate renewal, infrastructure as code |
| 01-03 | Removed legacy bucket immediately after migration | Least-privilege IAM, no stale permissions |
| 02-01 | jQuery/Bootstrap/Popper external, not bundled | Preserves plugin compatibility and load order |
| 02-01 | Revolution Slider copied as-is without hashing | Complex internal asset references would break |
| 02-01 | ES module project (type: module) | Modern Vite configuration support |
| 02-01 | Browser targets: no IE11 | Modern browsers only (>0.5%, last 2 versions) |
| 02-02 | Custom Vite plugin for Revolution Slider CSS | transformIndexHtml to fix CSS link tags converted to module scripts |
| 03-01 | Conservative quality: AVIF 85, WebP 85, JPEG 90 | Photography portfolio requires high quality preservation |
| 03-01 | 4 responsive widths: full, 1800w, 1200w, 800w | Optimal serving for different contexts (lightbox vs thumbnails) |
| 03-01 | PNG transparency detection | Skip JPEG for alpha images, use AVIF/WebP |
| 03-02 | Deferred quality review | Proceed with HTML updates while review continues in parallel |
| 03-03 | Lightbox uses JPEG-only | Format negotiation in JS is complex; JPEG has universal support |
| 03-03 | Small thumbnails use full/ only | Images <800px don't need smaller variants |
| 03-03 | Hero slider 1800w, no lazy loading | Above-fold content must load immediately |
| 03-04 | Portfolio srcset reduced to 800w only | Source images <1200px, optimization skips upscaling |
| 03-04 | Logo fallback uses WebP | PNG has alpha channel, JPEG doesn't support transparency |
| 04-01 | HTML validation focuses on critical errors only | Trailing whitespace and accessibility deferred |
| 04-01 | Deploy from dist/ not root | Proper Vite build deployment |
| 05-01 | Use env vars for workflow variables | Avoid YAML multiline parsing issues |
| 05-01 | Output names use underscores not hyphens | GitHub expression syntax compatibility |
| 06-01 | No lint-staged for pre-commit | Validation needs full project context for cross-file dependencies |
| 06-01 | User-friendly error messages | Cassie is non-technical, needs actionable fix suggestions |
| 07-01 | Keep original plugins.js and scripts.js | Reference files, not included in build output |
| 07-01 | Accept 316KB plugins vs 250KB target | Cube Portfolio (80KB) + Swiper (136KB) are required, 50% reduction achieved |
| 08-01 | GLightbox loaded as separate script | Maintains consistency with vendor scripts; easier to update |
| 08-01 | Use reload() on filter complete | Ensures lightbox works after Cubeportfolio filters images |
| 08-02 | Embla as UMD scripts | Consistent with vendor script pattern, easier updates |
| 08-02 | Static text overlay | Original animated text was overly complex; static achieves same effect |
| 08-02 | stopOnMouseEnter: false | Fixes BUG-03 (slider pausing on hover) |
| 08-03 | Delete Revolution Slider after verification | Ensure new slider works before removing old code |
| 08-03 | Absolute positioning for text overlay | Positions text correctly within fullscreen hero slider |
| 08-03 | Delay lightbox reload after filter | Ensures images are rendered before lightbox finds them |
| 10-01 | Bootstrap bundle instead of separate files | Combines Bootstrap JS with Popper v2, simplifies script management |
| 10-01 | Guard SmartMenus keydown handler | Check $.fn.dropdown exists before calling Bootstrap jQuery method |
| 11-01 | Muuri 0.9.5 | Latest stable version with vanilla JS, no dependencies |

### Pending Todos

None.

### Blockers/Concerns

From research - critical pitfalls to monitor during v2.0:

- ~~**Bootstrap data-* namespace**: `data-toggle` must become `data-bs-toggle`. Silent failure with no console errors.~~ RESOLVED in 10-01
- ~~**Bootstrap CSS class renames**: `.ml-*` to `.ms-*`, `.text-left` to `.text-start`. Audit all classes before migration.~~ RESOLVED in 10-01
- **Contact form AJAX migration**: 18 jQuery calls including `$.ajax()` must convert to fetch API.
- **Cubeportfolio replacement complexity**: Must replicate filtering, responsive columns, and GLightbox integration. IN PROGRESS - Muuri foundation laid in 11-01
- **Sticky header SmartMenus callback**: Headhesive's `onStick` callback currently initializes SmartMenus - must remove.
- **Dreamweaver workflow**: Build step must enhance, not replace HTML editing.

## Session Continuity

Last session: 2026-01-21
Stopped at: Completed 11-01-PLAN.md (Muuri library and CSS)
Resume file: None
Next step: Execute 11-02-PLAN.md (Update HTML structure)
