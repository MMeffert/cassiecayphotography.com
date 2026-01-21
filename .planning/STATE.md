# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-20)

**Core value:** The site must remain fast, secure, and easy for Cassie to update.
**Current focus:** v2.0 — jQuery Removal & Bootstrap 5 Migration

## Current Position

Phase: 14 - Contact Form Migration (COMPLETE)
Plan: 01 of 1 complete
Status: Phase complete
Last activity: 2026-01-21 — Completed 14-01-PLAN.md (Contact form fetch API migration)

Progress: [████████████░░░░░░░░] 4/6 phases

## Performance Metrics

**Velocity:**
- Total plans completed: 27
- Average duration: 5 min
- Total execution time: 125 min

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
| 11-portfolio-grid-replacement | 3 | 12 min | 4 min |
| 12-navigation-sticky-header | 2 | 7 min | 3.5 min |
| 13-utility-scripts-conversion | 1 | 1 min | 1 min |
| 14-contact-form-migration | 1 | 4 min | 4 min |

**Recent Trend:**
- Last 5 plans: 12-01 (3 min), 12-02 (4 min), 13-01 (1 min), 14-01 (4 min)
- Trend: Phase 14 complete. Contact form converted from jQuery AJAX to vanilla JS fetch API with Constraint Validation API.

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
| 11-02 | View Transitions API as progressive enhancement | Smoother filter animations on supporting browsers |
| 11-02 | 50ms delay before lightbox reload | Ensures DOM updates complete before GLightbox scans |
| 11-02 | portfolio-item-content wrapper | Required for Muuri's item structure |
| 11-03 | Image load handlers for Muuri | Ensures correct masonry layout calculation as images load |
| 11-03 | Muuri without imagesLoaded | Muuri's native refresh is sufficient; external library unnecessary |
| 12-01 | IntersectionObserver with sentinel for sticky | Replaces Headhesive offset checks with modern API |
| 12-01 | CSS scroll-behavior for smooth scroll | Native browser support, respects prefers-reduced-motion |
| 12-01 | Event delegation for hamburger menu | Works on both original and cloned navbar elements |
| 12-02 | Remove all navigation plugins together | SmartMenus, Headhesive, jQuery Easing, scrollUp all replaced by vanilla JS |
| 13-01 | IntersectionObserver with sentinel at 300px | Efficient scroll detection without scroll event listeners |
| 13-01 | prefers-reduced-motion for scroll-to-top | Accessibility compliance for motion preferences |
| 14-01 | Constraint Validation API over alert() | Browser-native validation with better UX and accessibility |
| 14-01 | fetch with response.ok check | fetch doesn't reject on HTTP errors - must explicitly check |
| 14-01 | form.reset() over individual clears | Cleaner, more maintainable than clearing 4 fields |

### Pending Todos

None.

### Blockers/Concerns

From research - critical pitfalls to monitor during v2.0:

- ~~**Bootstrap data-* namespace**: `data-toggle` must become `data-bs-toggle`. Silent failure with no console errors.~~ RESOLVED in 10-01
- ~~**Bootstrap CSS class renames**: `.ml-*` to `.ms-*`, `.text-left` to `.text-start`. Audit all classes before migration.~~ RESOLVED in 10-01
- ~~**Contact form AJAX migration**: 18 jQuery calls including `$.ajax()` must convert to fetch API.~~ RESOLVED in 14-01 - fetch API with Constraint Validation API
- ~~**Cubeportfolio replacement complexity**: Must replicate filtering, responsive columns, and GLightbox integration.~~ RESOLVED in 11-03 - Muuri fully integrated, Cubeportfolio removed (-87KB)
- ~~**Sticky header SmartMenus callback**: Headhesive's `onStick` callback currently initializes SmartMenus - must remove.~~ RESOLVED in 12-01 - Vanilla JS sticky header no longer uses SmartMenus callback
- **Dreamweaver workflow**: Build step must enhance, not replace HTML editing.

## Session Continuity

Last session: 2026-01-21
Stopped at: Completed 14-01-PLAN.md (Contact form fetch API migration)
Resume file: None
Next step: Phase 15 (jQuery removal) - final phase of v2.0 migration
