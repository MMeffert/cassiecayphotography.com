# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** The site must remain fast, secure, and easy for Cassie to update.
**Current focus:** Phase 5 - Notifications & Feedback

## Current Position

Phase: 5 of 9 (Notifications & Feedback)
Plan: 1 of 1 in current phase
Status: Phase complete
Last activity: 2026-01-20 - Completed 05-01-PLAN.md

Progress: [===========] 50%

## Performance Metrics

**Velocity:**
- Total plans completed: 11
- Average duration: 5 min
- Total execution time: 56 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-quick-fixes | 3 | 20 min | 7 min |
| 02-build-foundation | 2 | 9 min | 4.5 min |
| 03-image-optimization | 4 | 16 min | 4 min |
| 04-ci-validation | 1 | 3 min | 3 min |
| 05-notifications-feedback | 1 | 8 min | 8 min |

**Recent Trend:**
- Last 5 plans: 03-03 (6 min), 03-04 (3 min), 04-01 (3 min), 05-01 (8 min)
- Trend: Notifications took longer due to YAML debugging

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

### Pending Todos

None.

### Blockers/Concerns

From research - critical pitfalls to monitor:

- **Revolution Slider fragility**: Do NOT bundle Revolution Slider scripts or upgrade jQuery - ADDRESSED in 02-01 (copied as-is)
- **Dreamweaver workflow**: Build step must enhance, not replace HTML editing
- **Image quality**: Use conservative settings on photography portfolio (JPEG 85+, AVIF 60+) - ADDRESSED in 03-01 (AVIF 85, WebP 85, JPEG 90)
- **CloudFront cache**: 1-year cache on assets requires content hashing or invalidation - ADDRESSED in 02-01 (content hashing enabled)
- **Quality review**: Deferred review - monitor for issues in production

## Session Continuity

Last session: 2026-01-20T19:53:00Z
Stopped at: Completed 05-01-PLAN.md (Deploy notifications via SES)
Resume file: None
